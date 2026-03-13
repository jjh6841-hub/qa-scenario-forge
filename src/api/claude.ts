import Anthropic from '@anthropic-ai/sdk';
import { prompts } from '../data/prompts';
import type { RiskItem, TestScenario, TestCase, PlaywrightFile } from '../types';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 4096;

function extractJSON(text: string): string {
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error('응답에서 JSON을 찾을 수 없습니다.');
  }
  return text.slice(firstBrace, lastBrace + 1);
}

async function callClaude(systemPrompt: string, userMessage: string): Promise<string> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userMessage,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('예상치 못한 응답 형식입니다.');
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
  specText: string,
  risks: RiskItem[]
): Promise<TestScenario[]> {
  const userMessage = `다음 기능 명세서와 식별된 리스크 목록을 기반으로 테스트 시나리오를 생성해주세요.

## 기능 명세서
${specText}

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
  const userMessage = `다음 테스트 시나리오와 리스크를 기반으로 상세한 테스트 케이스를 작성해주세요.

## 테스트 시나리오
${JSON.stringify(scenarios, null, 2)}

## 관련 리스크
${JSON.stringify(risks, null, 2)}`;

  const rawResponse = await callClaude(prompts.generateCases, userMessage);
  const jsonString = extractJSON(rawResponse);
  const parsed = JSON.parse(jsonString) as { cases: TestCase[] };
  return parsed.cases;
}

export async function generatePlaywrightCode(
  cases: TestCase[],
  scenarios: TestScenario[]
): Promise<PlaywrightFile[]> {
  const userMessage = `다음 테스트 케이스와 시나리오를 기반으로 Playwright TypeScript 자동화 테스트 코드를 생성해주세요.

## 테스트 케이스 (자동화 가능한 케이스 우선)
${JSON.stringify(
    cases.filter((c) => c.automatable),
    null,
    2
  )}

## 테스트 시나리오
${JSON.stringify(scenarios, null, 2)}`;

  const rawResponse = await callClaude(prompts.generateCode, userMessage);
  const jsonString = extractJSON(rawResponse);
  const parsed = JSON.parse(jsonString) as { files: PlaywrightFile[] };
  return parsed.files;
}
