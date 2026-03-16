import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { model, max_tokens, system, messages } = req.body as {
    model: string;
    max_tokens: number;
    system: string;
    messages: Anthropic.MessageParam[];
  };

  if (!model || !messages?.length) {
    return res.status(400).json({ error: 'model and messages are required' });
  }

  try {
    const response = await client.messages.create({
      model,
      max_tokens: max_tokens ?? 8192,
      system,
      messages,
    });
    return res.status(200).json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류';
    const status = (error as { status?: number }).status ?? 500;
    return res.status(status).json({ error: message });
  }
}
