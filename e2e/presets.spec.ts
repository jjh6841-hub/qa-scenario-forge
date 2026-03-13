import { test, expect } from '@playwright/test';

test.describe('프리셋 선택 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('모든 프리셋 버튼이 표시된다', async ({ page }) => {
    await expect(page.locator('button', { hasText: 'EMR 처방 입력' })).toBeVisible();
    await expect(page.locator('button', { hasText: '의사 로그인 및 인증' })).toBeVisible();
    await expect(page.locator('button', { hasText: '진료 기록 조회' })).toBeVisible();
  });

  test('EMR 처방 입력 프리셋 클릭 시 텍스트가 입력된다', async ({ page }) => {
    await page.locator('button', { hasText: 'EMR 처방 입력' }).click();
    const textarea = page.locator('textarea');
    const value = await textarea.inputValue();
    expect(value).toContain('처방 입력 화면 기능 명세서');
    expect(value.length).toBeGreaterThan(200);
  });

  test('프리셋 클릭 시 해당 버튼이 활성 상태가 된다', async ({ page }) => {
    const presetButton = page.locator('button', { hasText: '의사 로그인 및 인증' });
    await presetButton.click();
    await expect(presetButton).toHaveClass(/bg-blue-900/);
  });

  test('다른 프리셋 클릭 시 이전 프리셋의 활성 상태가 해제된다', async ({ page }) => {
    const firstPreset = page.locator('button', { hasText: 'EMR 처방 입력' });
    const secondPreset = page.locator('button', { hasText: '의사 로그인 및 인증' });

    await firstPreset.click();
    await expect(firstPreset).toHaveClass(/bg-blue-900/);

    await secondPreset.click();
    await expect(secondPreset).toHaveClass(/bg-blue-900/);
    await expect(firstPreset).not.toHaveClass(/bg-blue-900/);
  });
});
