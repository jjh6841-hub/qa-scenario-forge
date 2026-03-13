# 테스트 전략 문서 (Test Strategy)
## QA Scenario Forge

**버전**: 1.0.0
**작성일**: 2026-03-13

---

## 1. 테스트 목표

QA Scenario Forge의 테스트 전략은 다음 목표를 달성하기 위해 수립되었다:

1. **기능 정확성 보장**: 4단계 AI 파이프라인이 올바른 순서로 실행되고 결과를 정확하게 처리함
2. **UI 컴포넌트 신뢰성**: 사용자 인터랙션 흐름이 올바르게 동작함
3. **상태 관리 검증**: AppContext의 reducer가 모든 액션 타입을 정확하게 처리함
4. **유틸리티 함수 검증**: 색상 계산, 내보내기, 포맷팅 함수의 정확성

## 2. 테스트 피라미드 (Test Pyramid)

```
         /\
        /E2E\      ~8개 테스트
       /------\    (Playwright)
      /통합 테스트\  ~12개 테스트
     /------------\ (React Testing Library)
    /  단위 테스트  \ ~40개 테스트
   /--------------\ (Vitest)
```

### 2.1 단위 테스트 (Unit Tests) - ~40개
**도구**: Vitest + @testing-library/react

**대상**:
- `src/utils/riskColors.ts` - 색상 및 점수 계산 (10개)
- `src/utils/exporters.ts` - 파일 내보내기 (8개)
- `src/utils/formatters.ts` - 텍스트 포맷팅 (6개)
- `src/components/common/` - Badge, Spinner (4개)
- `src/components/input/AnalyzeButton.tsx` (7개)
- `src/components/results/risk/RiskHeatmap.tsx` (5개)
- `src/components/input/PresetSelector.tsx` (5개)
- `src/components/results/cases/TestCaseTable.tsx` (5개)

### 2.2 통합 테스트 (Integration Tests) - ~12개
**도구**: Vitest + renderHook + @testing-library/react

**대상**:
- `src/test/integration/analysisPipeline.test.ts` (6개)
  - 파이프라인 4단계 순차 실행 검증
  - 단계별 에러 처리 검증
  - 액션 디스패치 순서 검증
- `src/test/integration/presetFlow.test.tsx` (4개)
  - 프리셋 선택 → 텍스트 입력 → 분석 버튼 활성화 흐름
- `src/test/integration/exportFlow.test.tsx` (3개)
  - 결과 완료 상태에서의 내보내기 흐름

### 2.3 E2E 테스트 (E2E Tests) - ~8개
**도구**: Playwright (Chromium only)

**대상**:
- `e2e/full-pipeline.spec.ts` (2개)
- `e2e/presets.spec.ts` (4개)
- `e2e/export.spec.ts` (3개)
- `e2e/error-handling.spec.ts` (2개)

## 3. 리스크 기반 테스트 방법론 (Risk-Based Testing)

### 3.1 의료 도메인 리스크 분류

| 리스크 영역 | 중요도 | 테스트 집중도 |
|---|---|---|
| 환자 안전 (DUR, 투약 오류) | 매우 높음 | P1 테스트 케이스 필수 |
| 법령 준수 (심평원, 의료법) | 높음 | 컴플라이언스 시나리오 포함 |
| 데이터 무결성 | 높음 | 저장/로드 오류 케이스 포함 |
| 보안 (인증, 권한) | 높음 | 보안 시나리오 포함 |
| 성능 (응답 시간) | 보통 | 부하 테스트는 별도 |
| 사용성 | 낮음 | UI 스모크 테스트 수준 |

### 3.2 리스크 점수 계산

```
리스크 점수 = 영향도(1-5) × 발생가능성(1-5)

점수 범위:
- 20-25: 위험 (RED)    → P1 테스트 케이스 필수
- 10-19: 높음 (ORANGE) → P1-P2 테스트 케이스 권장
- 6-9:   보통 (YELLOW) → P2-P3 테스트 케이스
- 1-5:   낮음 (GREEN)  → P3 테스트 케이스 또는 생략
```

## 4. 테스트 환경 설정 (Test Environment Setup)

### 4.1 단위/통합 테스트 환경

```bash
# 의존성 설치
npm ci

# 테스트 실행
npm run test

# 커버리지 포함 실행
npm run test:coverage

# 감시 모드
npm run test -- --watch
```

**환경 설정** (`vitest.config.ts`):
- 환경: jsdom
- 셋업 파일: `src/test/setup.ts`
- 커버리지 임계값: 70% (lines, functions, branches, statements)

### 4.2 E2E 테스트 환경

```bash
# Playwright 브라우저 설치 (최초 1회)
npx playwright install chromium

# E2E 테스트 실행 (dev server 자동 시작)
npm run test:e2e

# 헤드 모드로 실행 (브라우저 표시)
npx playwright test --headed

# 특정 파일만 실행
npx playwright test e2e/presets.spec.ts
```

**환경 설정** (`playwright.config.ts`):
- baseURL: `http://localhost:5173`
- webServer 자동 시작
- Chromium 전용
- 스크린샷: 실패 시에만

### 4.3 CI 환경 (GitHub Actions)

```yaml
- npm ci
- npm run lint
- npx tsc --noEmit -p tsconfig.app.json
- npm run test:coverage
- npm run build
```

E2E 테스트는 CI에서 선택적으로 실행 (API 키 필요).

## 5. 모킹 전략 (Mocking Strategy)

### 5.1 Claude API 모킹

모든 단위/통합 테스트에서 `src/api/claude.ts`를 모킹하여 실제 API 호출을 방지:

```typescript
vi.mock('../../api/claude', () => ({
  analyzeRisk: vi.fn().mockResolvedValue(mockRisks),
  generateScenarios: vi.fn().mockResolvedValue(mockScenarios),
  generateCases: vi.fn().mockResolvedValue(mockCases),
  generatePlaywrightCode: vi.fn().mockResolvedValue(mockPlaywrightFiles),
}));
```

모킹 데이터는 `src/test/mocks/apiFixtures.ts`에 중앙 관리.

### 5.2 브라우저 API 모킹

`src/test/setup.ts`에서 전역 모킹:
- `global.fetch`
- `URL.createObjectURL` / `URL.revokeObjectURL`
- `navigator.clipboard`

## 6. 커버리지 목표 (Coverage Targets)

| 레이어 | 목표 커버리지 | 측정 방법 |
|---|---|---|
| 유틸리티 함수 | 90%+ | Vitest coverage-v8 |
| React 컴포넌트 | 75%+ | Vitest coverage-v8 |
| Hook/Context | 80%+ | Vitest coverage-v8 |
| 전체 프로젝트 | 70%+ | Vitest coverage-v8 |

커버리지 제외 대상:
- `src/types/` (타입 선언만)
- `src/main.tsx` (진입점)
- `src/test/` (테스트 코드 자체)
- `e2e/` (E2E 테스트)
- 설정 파일 (`*.config.*`)

## 7. 테스트 명명 규칙 (Test Naming Conventions)

```typescript
describe('[컴포넌트/함수 이름]', () => {
  it('should [기대 동작] when [조건]', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

예시:
```typescript
describe('AnalyzeButton', () => {
  it('should be disabled when specText is empty', () => { ... });
  it('should call onAnalyze when clicked and enabled', () => { ... });
});
```

## 8. 회귀 테스트 정책 (Regression Policy)

- 버그 수정 시 해당 버그를 재현하는 테스트 케이스 의무 추가
- PR 머지 전 모든 테스트 통과 필수
- 커버리지 임계값 미달 시 빌드 실패
