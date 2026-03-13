import type { RiskItem, TestScenario, TestCase, PlaywrightFile } from '../../types';

export const mockRisks: RiskItem[] = [
  {
    id: 'RISK-001',
    category: '환자 안전',
    title: 'DUR 경보 무시로 인한 투약 오류',
    description:
      '의사가 DUR 경보를 확인하지 않고 처방을 강행할 경우, 약물 상호작용으로 인한 환자 피해 발생 가능성이 있습니다.',
    impact: 5,
    likelihood: 3,
    priority: 'critical',
  },
  {
    id: 'RISK-002',
    category: '규정 준수',
    title: '심평원 청구 코드 오류',
    description:
      '의약품 보험 급여 코드가 잘못 적용될 경우 심평원 청구 시 오류가 발생하고, 허위 청구로 간주될 수 있습니다.',
    impact: 4,
    likelihood: 3,
    priority: 'high',
  },
  {
    id: 'RISK-003',
    category: '데이터 무결성',
    title: '처방 데이터 저장 실패',
    description:
      '처방 저장 중 네트워크 오류 발생 시 처방 데이터가 부분 저장되거나 유실될 수 있습니다.',
    impact: 5,
    likelihood: 2,
    priority: 'high',
  },
  {
    id: 'RISK-004',
    category: '보안',
    title: '처방 데이터 무단 접근',
    description:
      '권한이 없는 사용자가 다른 의사의 처방 내역에 접근할 수 있는 취약점이 존재할 수 있습니다.',
    impact: 4,
    likelihood: 2,
    priority: 'high',
  },
  {
    id: 'RISK-005',
    category: '성능',
    title: 'DUR 점검 응답 지연',
    description:
      '심평원 DUR 시스템 응답이 지연될 경우 의사의 처방 워크플로우가 중단되고 진료 효율이 저하됩니다.',
    impact: 3,
    likelihood: 4,
    priority: 'high',
  },
  {
    id: 'RISK-006',
    category: '환자 안전',
    title: '알레르기 정보 미확인으로 인한 처방 오류',
    description:
      '환자의 약물 알레르기 정보가 처방 화면에 표시되지 않을 경우, 알레르기 반응을 유발하는 약물이 처방될 수 있습니다.',
    impact: 5,
    likelihood: 2,
    priority: 'critical',
  },
];

export const mockScenarios: TestScenario[] = [
  {
    id: 'SCN-001',
    title: 'DUR 병용 금기 경보 발생 및 처리 검증',
    riskIds: ['RISK-001'],
    type: 'functional',
    preconditions: [
      '테스트 의사 계정(doctor_test@hospital.com)으로 EMR 시스템에 로그인된 상태',
      '테스트 환자 홍길동(차트번호: T001)이 선택된 상태',
      '처방 입력 화면이 활성화된 상태',
      'DUR 시스템 연동이 정상 작동 중인 상태',
    ],
    description:
      '병용 금기 의약품을 동시 처방할 때 DUR 경보가 올바르게 발생하고, 의사가 사유 입력 후 처방 강행 또는 취소를 할 수 있는지 검증합니다.',
  },
  {
    id: 'SCN-002',
    title: '보험 급여 코드 자동 적용 및 본인부담금 계산 검증',
    riskIds: ['RISK-002'],
    type: 'compliance',
    preconditions: [
      '테스트 의사 계정으로 로그인된 상태',
      '건강보험 가입자인 테스트 환자(T002) 선택된 상태',
      '보험 급여 의약품 목록이 최신 상태로 업데이트된 상태',
    ],
    description:
      '처방된 의약품에 대한 건강보험 급여 코드가 자동으로 적용되고, 급여 유형에 따른 본인부담금이 정확하게 계산되는지 검증합니다.',
  },
  {
    id: 'SCN-003',
    title: '처방 저장 실패 시 데이터 무결성 검증',
    riskIds: ['RISK-003'],
    type: 'functional',
    preconditions: [
      '테스트 환경에서 네트워크 지연/실패 시뮬레이션 가능한 상태',
      '처방 입력이 완료된 상태',
    ],
    description:
      '처방 저장 도중 네트워크 오류가 발생할 때 데이터가 안전하게 롤백되거나 재시도할 수 있는지 검증합니다.',
  },
];

export const mockCases: TestCase[] = [
  {
    id: 'TC-001',
    scenarioId: 'SCN-001',
    title: 'DUR 병용 금기 경보 팝업 표시 확인',
    steps: [
      {
        order: 1,
        action: '처방 입력 화면에서 의약품 검색창에 "아스피린" 입력 후 선택',
        expectedResult: '아스피린 100mg 처방 항목이 처방 목록에 추가됨',
      },
      {
        order: 2,
        action: '의약품 검색창에 "와파린" 입력 후 선택',
        expectedResult: 'DUR 병용 금기 경보 팝업이 즉시 표시됨',
      },
      {
        order: 3,
        action: 'DUR 경보 팝업의 내용 확인',
        expectedResult:
          '경보 내용(아스피린+와파린 병용 금기), 사유 입력 필드, 처방 강행/취소 버튼이 표시됨',
      },
      {
        order: 4,
        action: '처방 취소 버튼 클릭',
        expectedResult: '와파린 처방 항목이 목록에서 제거되고 팝업이 닫힘',
      },
    ],
    expectedResult: 'DUR 병용 금기 경보가 올바르게 표시되고 처방 취소가 정상 처리됨',
    priority: 'P1',
    automatable: true,
  },
  {
    id: 'TC-002',
    scenarioId: 'SCN-001',
    title: 'DUR 경보 무시 후 처방 강행 및 감사 로그 기록 확인',
    steps: [
      {
        order: 1,
        action: '처방 목록에 병용 금기 의약품 두 가지를 추가하여 DUR 경보 발생',
        expectedResult: 'DUR 병용 금기 경보 팝업이 표시됨',
      },
      {
        order: 2,
        action: '사유 입력 필드에 "환자 동의 하에 필요 처방" 입력',
        expectedResult: '사유 텍스트가 입력 필드에 표시됨',
      },
      {
        order: 3,
        action: '처방 강행 버튼 클릭',
        expectedResult: '팝업이 닫히고 처방이 저장됨. 감사 로그에 DUR 경보 무시 이력이 기록됨',
      },
    ],
    expectedResult: 'DUR 경보 무시 후 처방 강행이 가능하고 감사 로그에 이력이 기록됨',
    priority: 'P1',
    automatable: true,
  },
  {
    id: 'TC-003',
    scenarioId: 'SCN-002',
    title: '보험 급여 의약품 100/100 급여 코드 자동 적용 확인',
    steps: [
      {
        order: 1,
        action: '처방 입력 화면에서 100% 급여 의약품 검색 및 선택',
        expectedResult: '의약품이 처방 목록에 추가되고 급여 유형이 "100/100"으로 표시됨',
      },
      {
        order: 2,
        action: '처방 요약 화면에서 본인부담금 확인',
        expectedResult: '해당 의약품의 본인부담금이 0원으로 계산됨',
      },
    ],
    expectedResult: '보험 급여 코드가 자동으로 올바르게 적용되고 본인부담금이 정확하게 계산됨',
    priority: 'P2',
    automatable: true,
  },
];

export const mockPlaywrightFiles: PlaywrightFile[] = [
  {
    filename: 'tests/emr-prescription-dur.spec.ts',
    description: 'DUR 경보 처리 자동화 테스트',
    code: `import { test, expect } from '@playwright/test';

// EMR 처방 입력 DUR 검사 자동화 테스트
test.describe('DUR 경보 처리', () => {
  test.beforeEach(async ({ page }) => {
    // 테스트 의사 계정으로 로그인
    await page.goto('/login');
    await page.fill('[data-testid="username"]', process.env.TEST_DOCTOR_ID ?? 'test_doctor');
    await page.fill('[data-testid="password"]', process.env.TEST_DOCTOR_PW ?? 'Test1234!');
    await page.click('[data-testid="login-btn"]');
    await page.waitForURL('/dashboard');

    // 처방 입력 화면으로 이동
    await page.goto('/prescription/new');
  });

  test('병용 금기 DUR 경보가 표시되어야 한다', async ({ page }) => {
    // 아스피린 처방 추가
    await page.fill('[data-testid="drug-search"]', '아스피린');
    await page.click('[data-testid="drug-result-aspirin"]');

    // 와파린 추가 시 DUR 경보 발생 대기
    await page.fill('[data-testid="drug-search"]', '와파린');

    const durAlertPromise = page.waitForSelector('[data-testid="dur-alert-modal"]');
    await page.click('[data-testid="drug-result-warfarin"]');

    const durAlert = await durAlertPromise;
    await expect(durAlert).toBeVisible();
    await expect(page.locator('[data-testid="dur-alert-title"]')).toContainText('병용 금기');
  });

  test('DUR 경보 확인 후 처방 취소가 가능해야 한다', async ({ page }) => {
    await page.fill('[data-testid="drug-search"]', '아스피린');
    await page.click('[data-testid="drug-result-aspirin"]');
    await page.fill('[data-testid="drug-search"]', '와파린');
    await page.waitForSelector('[data-testid="dur-alert-modal"]');
    await page.click('[data-testid="drug-result-warfarin"]');

    await page.click('[data-testid="dur-cancel-btn"]');

    await expect(page.locator('[data-testid="dur-alert-modal"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="prescription-item-warfarin"]')).not.toBeVisible();
  });
});`,
  },
  {
    filename: 'tests/emr-insurance-code.spec.ts',
    description: '보험 급여 코드 자동화 테스트',
    code: `import { test, expect } from '@playwright/test';

// 보험 급여 코드 처리 자동화 테스트
test.describe('보험 급여 코드 적용', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="username"]', process.env.TEST_DOCTOR_ID ?? 'test_doctor');
    await page.fill('[data-testid="password"]', process.env.TEST_DOCTOR_PW ?? 'Test1234!');
    await page.click('[data-testid="login-btn"]');
    await page.waitForURL('/dashboard');
  });

  test('100% 급여 의약품에 올바른 코드가 적용되어야 한다', async ({ page }) => {
    await page.goto('/prescription/new?patient=T002');

    await page.fill('[data-testid="drug-search"]', '아목시실린');
    await page.click('[data-testid="drug-result-amoxicillin"]');

    await expect(page.locator('[data-testid="insurance-type"]')).toContainText('100/100');
    await expect(page.locator('[data-testid="patient-copay"]')).toContainText('0원');
  });
});`,
  },
];
