import { test, expect } from '@playwright/test';

/**
 * 전체 파이프라인 E2E 테스트
 * 데모 모드를 활용하여 API 키 없이 CI 환경에서도 실행 가능
 */
test.describe('전체 파이프라인 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=QA Scenario Forge')).toBeVisible();
  });

  test('데모 모드로 전체 4단계 파이프라인 결과가 표시된다', async ({ page }) => {
    // 데모 버튼이 표시되어야 함
    const demoButton = page.locator('[data-testid="demo-button"]');
    await expect(demoButton).toBeVisible();

    // 데모 실행
    await demoButton.click();

    // 4개 탭 헤더가 모두 표시되어야 함
    await expect(page.locator('[role="tablist"]')).toBeVisible();
    await expect(page.locator('#tab-risks')).toBeVisible();
    await expect(page.locator('#tab-scenarios')).toBeVisible();
    await expect(page.locator('#tab-cases')).toBeVisible();
    await expect(page.locator('#tab-code')).toBeVisible();

    // 첫 번째 탭(리스크 분석)에 숫자 배지가 표시되어야 함
    const risksBadge = page.locator('#tab-risks .rounded-full');
    await expect(risksBadge).toBeVisible();
    const badgeText = await risksBadge.textContent();
    expect(Number(badgeText)).toBeGreaterThan(0);
  });

  test('데모 모드 후 탭 전환이 올바르게 동작한다', async ({ page }) => {
    await page.locator('[data-testid="demo-button"]').click();

    // 리스크 탭이 기본 활성 탭이어야 함
    const risksTab = page.locator('#tab-risks');
    await expect(risksTab).toHaveAttribute('aria-selected', 'true');

    // 시나리오 탭으로 전환
    await page.locator('#tab-scenarios').click();
    await expect(page.locator('#tab-scenarios')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#tab-risks')).toHaveAttribute('aria-selected', 'false');
    await expect(page.locator('#tabpanel-scenarios')).not.toHaveAttribute('hidden');
    await expect(page.locator('#tabpanel-risks')).toHaveAttribute('hidden', '');

    // 테스트 케이스 탭으로 전환
    await page.locator('#tab-cases').click();
    await expect(page.locator('#tab-cases')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#tabpanel-cases')).not.toHaveAttribute('hidden');

    // 코드 탭으로 전환
    await page.locator('#tab-code').click();
    await expect(page.locator('#tab-code')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#tabpanel-code')).not.toHaveAttribute('hidden');
  });

  test('데모 모드 후 도메인 점수 바가 표시된다', async ({ page }) => {
    await page.locator('[data-testid="demo-button"]').click();

    // 리스크 완료 후 도메인 점수 바 표시
    const domainScores = page.locator('text=환자 안전').or(page.locator('text=법령 준수')).or(page.locator('text=데이터 무결성'));
    await expect(domainScores.first()).toBeVisible();
  });

  test('프리셋 선택 후 분석 버튼이 활성화된다', async ({ page }) => {
    // 분석 버튼은 초기에 비활성화
    const analyzeButton = page.locator('button', { hasText: 'QA 시나리오 분석 시작' });
    await expect(analyzeButton).toBeDisabled();

    // 프리셋 클릭 후 활성화
    await page.locator('button', { hasText: 'EMR 처방 입력' }).click();
    await expect(analyzeButton).toBeEnabled();
  });
});
