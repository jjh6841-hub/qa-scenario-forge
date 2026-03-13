import { test, expect } from '@playwright/test';

/**
 * 내보내기 기능 E2E 테스트
 * 데모 모드를 활용하여 API 키 없이 CI 환경에서도 실행 가능
 */
test.describe('내보내기 기능 E2E 테스트', () => {
  test('초기 상태에서는 내보내기 바가 표시되지 않는다', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="export-bar"]')).not.toBeVisible();
  });

  test('데모 모드 실행 후 JSON/Markdown 내보내기 버튼이 표시된다', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="demo-button"]').click();

    await expect(page.locator('[data-testid="export-bar"]')).toBeVisible();
    await expect(page.locator('[data-testid="export-json"]')).toBeVisible();
    await expect(page.locator('[data-testid="export-markdown"]')).toBeVisible();
    await expect(page.locator('[data-testid="export-json"]')).toContainText('JSON 다운로드');
    await expect(page.locator('[data-testid="export-markdown"]')).toContainText('Markdown 다운로드');
  });

  test('JSON 내보내기 버튼 클릭 시 다운로드가 시작된다', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="demo-button"]').click();

    // 다운로드 이벤트 캡처
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('[data-testid="export-json"]').click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/qa-scenario-forge.*\.json$/);
  });

  test('Markdown 내보내기 버튼 클릭 시 다운로드가 시작된다', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="demo-button"]').click();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('[data-testid="export-markdown"]').click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/qa-scenario-forge.*\.md$/);
  });

  test('초기화 후 내보내기 바가 다시 숨겨진다', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="demo-button"]').click();

    await expect(page.locator('[data-testid="export-bar"]')).toBeVisible();

    // 초기화 버튼 클릭
    await page.locator('button', { hasText: '초기화' }).click();
    await expect(page.locator('[data-testid="export-bar"]')).not.toBeVisible();
  });
});
