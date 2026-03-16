import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import Anthropic from '@anthropic-ai/sdk';

/**
 * 로컬 개발 전용 API 미들웨어 플러그인
 * 프로덕션(Vercel)에서는 api/claude.ts 서버리스 함수가 대신 처리
 */
function localApiPlugin(): Plugin {
  return {
    name: 'local-api',
    apply: 'serve', // 개발 서버에서만 활성화
    configureServer(server) {
      server.middlewares.use('/api/claude', (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', () => {
          void (async () => {
            try {
              const payload = JSON.parse(body) as {
                model: string;
                max_tokens: number;
                system: string;
                messages: Anthropic.MessageParam[];
              };
              const client = new Anthropic({
                apiKey: process.env.ANTHROPIC_API_KEY,
              });
              const response = await client.messages.create(payload);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(response));
            } catch (error) {
              const message = error instanceof Error ? error.message : '알 수 없는 오류';
              const status = (error as { status?: number }).status ?? 500;
              res.writeHead(status, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: message }));
            }
          })();
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
  base: process.env.GITHUB_PAGES ? '/qa-scenario-forge/' : '/',
});
