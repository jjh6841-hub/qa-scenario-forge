import { prompts } from '../data/prompts';
import type { RiskItem, TestScenario, TestCase, PlaywrightFile } from '../types';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 8192;

function extractJSON(text: string): string {
  // Find outermost { } pair
  const firstBrace = text.indexOf('{');
  if (firstBrace === -1) {
    throw new Error(`응답에서 JSON을 찾을 수 없습니다. 응답 시작: ${text.slice(0, 100)}`);
  }

  // Walk the string to find the matching closing brace
  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = firstBrace; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth === 0) return text.slice(firstBrace, i + 1);
    }
  }

  throw new Error('JSON이 완전하지 않습니다. 응답이 잘렸을 수 있습니다.');
}

async function callClaude(systemPrompt: string, userMessage: string): Promise<string> {
  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const error = await response.json() as { error?: string };
    throw new Error(error.error ?? `서버 오류: HTTP ${response.status}`);
  }

  const data = await response.json() as {
    content: Array<{ type: string; text: string }>;
    stop_reason: string;
  };

  const content = data.content[0];
  if (content.type !== 'text') {
    throw new Error('예상치 못한 응답 형식입니다.');
  }

  if (data.stop_reason === 'max_tokens') {
    throw new Error('응답이 너무 길어 잘렸습니다. 명세서를 더 간결하게 작성해주세요.');
  }

  return content.text;
}

export async function analyzeRisk(specText: string): Promise<RiskItem[]> {
  const userMessage = `다음 의료 EMR 기능 명세서를 분석하여 리스크를 식별해주세요:\n\n${specText}`;
  const rawResponse = await callClaude(prompts.analyzeRisk, userMessage);
  const jsonString = extractJSON(rawResponse);
  const parsed = JSON.parse(jsonString) as { risks: RiskItem[] };
  return parsed.risks;
}

export async function generateScenarios(
  _specText: string,
  risks: RiskItem[]
): Promise<TestScenario[]> {
  const userMessage = `식별된 리스크를 기반으로 테스트 시나리오를 생성해주세요.

## 식별된 리스크
${JSON.stringify(risks, null, 2)}`;

  const rawResponse = await callClaude(prompts.generateScenarios, userMessage);
  const jsonString = extractJSON(rawResponse);
  const parsed = JSON.parse(jsonString) as { scenarios: TestScenario[] };
  return parsed.scenarios;
}

export async function generateCases(
  scenarios: TestScenario[],
  risks: RiskItem[]
): Promise<TestCase[]> {
  const topScenarios = scenarios.slice(0, 6);
  const topRisks = risks.slice(0, 8);

  const userMessage = `다음 테스트 시나리오를 기반으로 상세한 테스트 케이스를 작성해주세요.

## 테스트 시나리오
${JSON.stringify(topScenarios, null, 2)}

## 관련 리스크 (참고)
${JSON.stringify(topRisks, null, 2)}`;

  const rawResponse = await callClaude(prompts.generateCases, userMessage);
  const jsonString = extractJSON(rawResponse);
  const parsed = JSON.parse(jsonString) as { cases: TestCase[] };
  return parsed.cases;
}

export async function generatePlaywrightCode(
  cases: TestCase[],
  scenarios: TestScenario[]
): Promise<PlaywrightFile[]> {
  const automatableCases = cases.filter((c) => c.automatable).slice(0, 8);
  const topScenarios = scenarios.slice(0, 4);

  const userMessage = `다음 테스트 케이스를 기반으로 Playwright TypeScript 자동화 코드를 생성해주세요.

## 자동화 대상 테스트 케이스
${JSON.stringify(automatableCases, null, 2)}

## 테스트 시나리오 (참고)
${JSON.stringify(topScenarios, null, 2)}`;

  const rawResponse = await callClaude(prompts.generateCode, userMessage);
  const jsonString = extractJSON(rawResponse);
  const parsed = JSON.parse(jsonString) as { files: PlaywrightFile[] };
  return parsed.files;
}
