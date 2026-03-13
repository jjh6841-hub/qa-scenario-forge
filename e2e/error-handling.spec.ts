import { test, expect } from '@playwright/test';

/**
 * 오류 처리 및 UI 상태 E2E 테스트
 */
test.describe('오류 처리 및 UI 상태 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('페이지가 정상적으로 로드된다', async ({ page }) => {
    await expect(page.locator('text=QA Scenario Forge')).toBeVisible();
    await expect(page.locator('text=의료 EMR 특화 AI QA 도구')).toBeVisible();
  });

  test('빈 텍스트에서 분석 버튼이 비활성화된다', async ({ page }) => {
    const analyzeButton = page.locator('button', { hasText: 'QA 시나리오 분석 시작' });
    await expect(analyzeButton).toBeDisabled();
  });

  test('텍스트 입력 후 분석 버튼이 활성화되고, 지우면 다시 비활성화된다', async ({ page }) => {
    const analyzeButton = page.locator('button', { hasText: 'QA 시나리오 분석 시작' });

    await page.locator('textarea').fill('테스트 명세서 내용');
    await expect(analyzeButton).toBeEnabled();

    await page.locator('textarea').fill('');
    await expect(analyzeButton).toBeDisabled();
  });

  test('데모 모드 실행 후 초기화하면 초기 상태로 돌아간다', async ({ page }) => {
    await page.locator('[data-testid="demo-button"]').click();

    // 결과가 표시된 상태
    await expect(page.locator('[data-testid="export-bar"]')).toBeVisible();

    // 초기화
    await page.locator('button', { hasText: '초기화' }).click();

    // 데모 버튼이 다시 표시되어야 함
    await expect(page.locator('[data-testid="demo-button"]')).toBeVisible();
    // 내보내기 바가 사라져야 함
    await expect(page.locator('[data-testid="export-bar"]')).not.toBeVisible();
  });

  test('입력 패널의 주요 UI 요소들이 모두 표시된다', async ({ page }) => {
    await expect(page.locator('text=입력 패널')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
    await expect(page.locator('[data-testid="demo-button"]')).toBeVisible();
    await expect(page.locator('button', { hasText: 'EMR 처방 입력' })).toBeVisible();
    await expect(page.locator('button', { hasText: '의사 로그인 및 인증' })).toBeVisible();
    await expect(page.locator('button', { hasText: '진료 기록 조회' })).toBeVisible();
  });
});
