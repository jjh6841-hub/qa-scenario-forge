# QA Scenario Forge - Claude Code Guide

## Project Overview

QA Scenario Forge is a browser-based SPA that uses the Anthropic Claude API to automatically generate QA test scenarios, test cases, and Playwright automation code from medical EMR (Electronic Medical Records) functional specifications written in Korean.

The application is specialized for the Korean medical domain, referencing regulations from 심평원 (Health Insurance Review & Assessment Service), 의료법 (Medical Service Act), and 개인정보보호법 (Personal Information Protection Act).

## Commands

```bash
# Development server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run unit/integration tests (Vitest)
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage report
npm run test:coverage

# Run E2E tests (Playwright)
npm run test:e2e

# Lint
npm run lint

# Type check
npx tsc --noEmit -p tsconfig.app.json
```

Add these scripts to package.json if not present:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test"
  }
}
```

## Architecture Overview

```
src/
├── types/index.ts          # All TypeScript interfaces and types
├── data/
│   ├── presets.ts          # Three Korean EMR domain presets
│   └── prompts.ts          # Four AI system prompts for pipeline stages
├── context/AppContext.tsx  # React Context + useReducer (global state)
├── api/claude.ts           # Anthropic SDK integration (4 API functions)
├── hooks/
│   └── useAnalysisPipeline.ts  # Orchestrates 4 sequential API calls
├── utils/
│   ├── riskColors.ts       # Color utilities for risk visualization
│   ├── exporters.ts        # JSON and Markdown export functions
│   └── formatters.ts       # Date, text formatting utilities
└── components/
    ├── common/             # Badge, Spinner reusable components
    ├── layout/             # Header, AppLayout
    ├── input/              # PresetSelector, SpecTextArea, AnalyzeButton, InputPanel
    ├── pipeline/           # PipelineProgress (5-step indicator)
    └── results/
        ├── risk/           # RiskHeatmap, RiskSummaryList
        ├── scenarios/      # ScenarioCard
        ├── cases/          # TestCaseTable
        ├── code/           # PlaywrightCodeTab
        ├── DomainScoreBar.tsx  # 3 circular SVG gauges
        ├── TabContainer.tsx    # 4-tab results container
        ├── ExportBar.tsx       # Export buttons
        └── ResultsPanel.tsx    # Combines all result components
```

## State Management

The app uses a single `AppContext` with `useReducer`. Key state shape:

```typescript
AppState {
  specText: string           // Input specification text
  isAnalyzing: boolean       // Pipeline running flag
  activeTab: ActiveTab       // Currently visible results tab
  results: {
    risks: StageState<RiskItem[]>
    scenarios: StageState<TestScenario[]>
    cases: StageState<TestCase[]>
    code: StageState<PlaywrightFile[]>
  }
}
```

## Analysis Pipeline

The pipeline runs 4 sequential Claude API calls:
1. `analyzeRisk(specText)` → `RiskItem[]`
2. `generateScenarios(specText, risks)` → `TestScenario[]`
3. `generateCases(scenarios, risks)` → `TestCase[]`
4. `generatePlaywrightCode(cases, scenarios)` → `PlaywrightFile[]`

Each stage dispatches `STAGE_START` → `STAGE_COMPLETE_*` or `STAGE_ERROR`. On stage completion, the active tab auto-switches to show the new results.

## Testing Conventions

### Unit Tests (Vitest + React Testing Library)
- Located in `src/test/` mirroring the `src/` structure
- Use `describe/it/expect` from vitest
- Import vitest functions explicitly: `import { describe, it, expect, vi, beforeEach } from 'vitest'`
- Mock API calls with `vi.mock('../../api/claude', ...)`
- Component tests use `@testing-library/react`

### Integration Tests
- Located in `src/test/integration/`
- Use `renderHook` for hook testing
- Use mock fixtures from `src/test/mocks/apiFixtures.ts`

### E2E Tests (Playwright)
- Located in `e2e/`
- Run against `http://localhost:5173` (Vite dev server)
- Chromium only for simplicity
- Use `data-testid` attributes for reliable selectors

## Common Patterns

### Adding a new API stage
1. Add new function to `src/api/claude.ts`
2. Add prompt to `src/data/prompts.ts`
3. Add new `StageState` and action types to `src/types/index.ts`
4. Update `appReducer` in `src/context/AppContext.tsx`
5. Update `useAnalysisPipeline.ts` to call the new function

### Adding a new preset
1. Add a new entry to the `presets` array in `src/data/presets.ts`
2. The `PresetSelector` component will automatically render it

### Mocking Claude API in tests
```typescript
vi.mock('../../api/claude', () => ({
  analyzeRisk: vi.fn().mockResolvedValue(mockRisks),
  // ...
}));
```

## Known Issues

1. **Tailwind CSS v4**: This project uses Tailwind CSS v4 which has a different config approach than v3. The `tailwind.config.js` and `postcss.config.js` follow the v4 pattern.

2. **dangerouslyAllowBrowser**: The Anthropic SDK is initialized with `dangerouslyAllowBrowser: true` for this browser-based demo. In production, API calls should be proxied through a backend server to protect the API key.

3. **Large LLM responses**: Claude may occasionally return responses that exceed the JSON structure. The `extractJSON` helper in `claude.ts` handles this by finding the first `{` to last `}` characters.

4. **Korean text rendering**: Ensure the browser has Korean font support. The app uses system fonts which should include Korean on most modern operating systems.

## Environment Setup

Create a `.env` file in the project root:
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

See `.env.example` for the template.

## Deployment

### GitHub Pages (현재 운영 중)

**URL**: https://jjh6841-hub.github.io/qa-scenario-forge/

자동 배포는 `.github/workflows/deploy.yml`이 담당. `master` 브랜치에 push하면 트리거된다.

```bash
# 로컬에서 프로덕션 빌드 검증
npm run build
npm run preview   # http://localhost:4173 에서 확인
```

배포 전 필수 확인:
1. `npm run lint` — 0 errors
2. `npx tsc --noEmit -p tsconfig.app.json` — 0 errors
3. `npm run test` — all pass
4. `npm run build` — 빌드 성공

**환경 변수 설정** (GitHub Pages):
- Repository → Settings → Secrets and variables → Actions
- `VITE_ANTHROPIC_API_KEY` 시크릿 추가
- `deploy.yml`이 빌드 시 자동으로 주입

### Vercel (대안)

`vercel.json`이 포함되어 있어 Vercel에도 즉시 배포 가능:

```bash
# Vercel CLI 사용
npm install -g vercel
vercel --prod
```

또는 Vercel 대시보드에서 GitHub 레포를 연결하고
환경 변수 `VITE_ANTHROPIC_API_KEY`를 설정.

### 로컬 프로덕션 환경 테스트

```bash
npm run build && npm run preview
# http://localhost:4173 에서 실제 배포와 동일한 환경으로 확인
```

### 보안 주의사항

`dangerouslyAllowBrowser: true`로 클라이언트에서 직접 API 호출 중.
실제 프로덕션 서비스라면 API 키를 서버에서 관리하고
프록시 엔드포인트를 통해 호출하도록 변경 필요.
