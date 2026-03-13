import type { AnalysisResults } from '../types';
import { formatDate } from './formatters';

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON(results: AnalysisResults, specText: string): void {
  const exportData = {
    exportedAt: new Date().toISOString(),
    specText,
    risks: results.risks.data ?? [],
    scenarios: results.scenarios.data ?? [],
    cases: results.cases.data ?? [],
    playwrightFiles: results.code.data ?? [],
  };

  const content = JSON.stringify(exportData, null, 2);
  const filename = `qa-scenario-forge-${formatDate()}.json`;
  downloadFile(content, filename, 'application/json');
}

export function exportToMarkdown(results: AnalysisResults, specText: string): void {
  const lines: string[] = [];
  const date = formatDate();

  lines.push('# QA Scenario Forge 분석 결과');
  lines.push('');
  lines.push(`**생성일시**: ${new Date().toLocaleString('ko-KR')}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Spec Text
  lines.push('## 기능 명세서');
  lines.push('');
  lines.push('```');
  lines.push(specText);
  lines.push('```');
  lines.push('');

  // Risks
  lines.push('## 리스크 분석 결과');
  lines.push('');
  if (results.risks.data && results.risks.data.length > 0) {
    lines.push('| ID | 카테고리 | 제목 | 영향도 | 발생가능성 | 우선순위 |');
    lines.push('|---|---|---|---|---|---|');
    for (const risk of results.risks.data) {
      lines.push(
        `| ${risk.id} | ${risk.category} | ${risk.title} | ${risk.impact} | ${risk.likelihood} | ${risk.priority} |`
      );
    }
    lines.push('');
    for (const risk of results.risks.data) {
      lines.push(`### ${risk.id}: ${risk.title}`);
      lines.push('');
      lines.push(`**카테고리**: ${risk.category}`);
      lines.push('');
      lines.push(`**설명**: ${risk.description}`);
      lines.push('');
    }
  } else {
    lines.push('리스크 분석 데이터가 없습니다.');
    lines.push('');
  }

  // Scenarios
  lines.push('## 테스트 시나리오');
  lines.push('');
  if (results.scenarios.data && results.scenarios.data.length > 0) {
    for (const scenario of results.scenarios.data) {
      lines.push(`### ${scenario.id}: ${scenario.title}`);
      lines.push('');
      lines.push(`**유형**: ${scenario.type}`);
      lines.push('');
      lines.push(`**설명**: ${scenario.description}`);
      lines.push('');
      lines.push('**사전 조건**:');
      for (const precondition of scenario.preconditions) {
        lines.push(`- ${precondition}`);
      }
      lines.push('');
      lines.push(`**관련 리스크**: ${scenario.riskIds.join(', ')}`);
      lines.push('');
    }
  } else {
    lines.push('시나리오 데이터가 없습니다.');
    lines.push('');
  }

  // Test Cases
  lines.push('## 테스트 케이스');
  lines.push('');
  if (results.cases.data && results.cases.data.length > 0) {
    for (const tc of results.cases.data) {
      lines.push(`### ${tc.id}: ${tc.title}`);
      lines.push('');
      lines.push(`**우선순위**: ${tc.priority} | **자동화 가능**: ${tc.automatable ? '예' : '아니오'}`);
      lines.push('');
      lines.push('**테스트 단계**:');
      lines.push('');
      for (const step of tc.steps) {
        lines.push(`${step.order}. **액션**: ${step.action}`);
        lines.push(`   - **기대 결과**: ${step.expectedResult}`);
      }
      lines.push('');
      lines.push(`**최종 기대 결과**: ${tc.expectedResult}`);
      lines.push('');
    }
  } else {
    lines.push('테스트 케이스 데이터가 없습니다.');
    lines.push('');
  }

  // Playwright Code
  lines.push('## Playwright 자동화 코드');
  lines.push('');
  if (results.code.data && results.code.data.length > 0) {
    for (const file of results.code.data) {
      lines.push(`### ${file.filename}`);
      lines.push('');
      lines.push(`${file.description}`);
      lines.push('');
      lines.push('```typescript');
      lines.push(file.code);
      lines.push('```');
      lines.push('');
    }
  } else {
    lines.push('Playwright 코드 데이터가 없습니다.');
    lines.push('');
  }

  const content = lines.join('\n');
  const filename = `qa-scenario-forge-${date}.md`;
  downloadFile(content, filename, 'text/markdown');
}
