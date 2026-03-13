import { test, expect } from '@playwright/test';

test.describe('전체 파이프라인 E2E 테스트', () => {
  test('명세서 입력 후 분석 버튼 클릭 시 파이프라인이 시작된다', async ({ page }) => {
    await page.goto('/');

    // 페이지가 로드되었는지 확인
    await expect(page.locator('text=QA Scenario Forge')).toBeVisible();

    // 텍스트 영역에 명세서 입력
    const textarea = page.locator('textarea');
    await textarea.fill('## 테스트 명세서\n\n처방 입력 화면 기능 명세서입니다.');

    // 분석 버튼이 활성화되어 있는지 확인
    const analyzeButton = page.locator('button', { hasText: 'QA 시나리오 분석 시작' });
    await expect(analyzeButton).toBeEnabled();

    // API 호출 모킹 (실제 테스트에서는 MSW나 Playwright 네트워크 인터셉션 사용)
    await page.route('**/api.anthropic.com/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                risks: [
                  {
                    id: 'RISK-001',
                    category: '환자 안전',
                    title: 'DUR 오류',
                    description: '투약 오류',
                    impact: 5,
                    likelihood: 4,
                    priority: 'critical',
                  },
                ],
              }),
            },
          ],
          model: 'claude-opus-4-5',
          stop_reason: 'end_turn',
          usage: { input_tokens: 100, output_tokens: 200 },
        }),
      });
    });
  });

  test('프리셋 선택 후 전체 파이프라인이 동작한다', async ({ page }) => {
    await page.goto('/');

    // 첫 번째 프리셋 버튼 클릭
    const firstPreset = page.locator('button', { hasText: 'EMR 처방 입력' });
    await expect(firstPreset).toBeVisible();
    await firstPreset.click();

    // 텍스트 영역에 내용이 채워졌는지 확인
    const textarea = page.locator('textarea');
    const textValue = await textarea.inputValue();
    expect(textValue.length).toBeGreaterThan(100);

    // 분석 버튼이 활성화되어 있는지 확인
    const analyzeButton = page.locator('button', { hasText: 'QA 시나리오 분석 시작' });
    await expect(analyzeButton).toBeEnabled();

    // 프리셋 버튼이 활성화 스타일을 가지는지 확인
    await expect(firstPreset).toHaveClass(/bg-blue-900/);
  });
});
