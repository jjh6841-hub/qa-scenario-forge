# 개발 로그 (Development Log)
## QA Scenario Forge

---

## Session 1: 프로젝트 설정 및 스캐폴딩
**날짜**: 2026-03-13
**작업자**: 개발팀

### 완료된 작업
- Vite + React + TypeScript 프로젝트 초기 스캐폴딩 완료
  - `npm create vite@latest qa-scenario-forge -- --template react-ts`
- 핵심 의존성 설치:
  - `@anthropic-ai/sdk` - Claude AI API 클라이언트
  - `react-syntax-highlighter` - 코드 구문 강조
  - `tailwindcss`, `autoprefixer`, `postcss` - 스타일링
- 개발 의존성 설치:
  - `vitest`, `@vitest/coverage-v8`, `jsdom` - 단위/통합 테스트
  - `@testing-library/react`, `@testing-library/jest-dom` - 컴포넌트 테스트
  - `@playwright/test` - E2E 테스트

### 주요 결정 사항
- **상태 관리**: Redux 대신 React Context + useReducer 선택 (라이브러리 의존성 최소화)
- **CSS**: CSS Modules 대신 Tailwind CSS v4 채택 (빠른 스타일링)
- **API 호출 전략**: 4단계 순차 파이프라인으로 각 단계가 이전 단계 결과에 의존
- **타입 정의**: `src/types/index.ts`에 모든 타입 중앙 관리

### 직면한 문제 및 해결
- Tailwind CSS v4는 v3와 설정 방식이 다름. `postcss.config.js`와 `tailwind.config.js` 모두 필요.
- `dangerouslyAllowBrowser: true` 설정이 브라우저 환경에서의 Anthropic SDK 사용에 필수.

---

## Session 2: 문서화 및 테스트 인프라 구축
**날짜**: 2026-03-13
**작업자**: 개발팀

### 완료된 작업

#### 핵심 소스 코드
- `src/types/index.ts` - 전체 TypeScript 인터페이스 정의
- `src/data/presets.ts` - 3개 한국 의료 EMR 도메인 프리셋 (처방 입력, 로그인/인증, 진료 기록 조회)
- `src/data/prompts.ts` - 4단계 파이프라인용 Claude AI 시스템 프롬프트
- `src/context/AppContext.tsx` - React Context + useReducer 전역 상태 관리
- `src/api/claude.ts` - Anthropic SDK 연동 (4개 API 함수)
- `src/hooks/useAnalysisPipeline.ts` - 4단계 파이프라인 오케스트레이션 훅

#### 유틸리티 함수
- `src/utils/riskColors.ts` - 리스크 색상 및 도메인 점수 계산
- `src/utils/exporters.ts` - JSON/Markdown 파일 내보내기
- `src/utils/formatters.ts` - 날짜, 텍스트 포맷팅, JSON 파싱

#### UI 컴포넌트 (34개 파일)
- `src/components/common/` - Badge, Spinner 공통 컴포넌트
- `src/components/layout/` - Header, AppLayout
- `src/components/input/` - PresetSelector, SpecTextArea, AnalyzeButton, InputPanel
- `src/components/pipeline/` - PipelineProgress (5단계 진행 표시기)
- `src/components/results/` - RiskHeatmap, RiskSummaryList, ScenarioCard, TestCaseTable, PlaywrightCodeTab, DomainScoreBar, TabContainer, ExportBar, ResultsPanel

#### 테스트 파일 (17개)
- 단위 테스트: riskColors, exporters, formatters, AnalyzeButton, RiskHeatmap, PresetSelector, TestCaseTable
- 통합 테스트: analysisPipeline, presetFlow, exportFlow
- E2E 테스트: full-pipeline, presets, export, error-handling
- 테스트 설정: setup.ts, apiFixtures.ts

#### 설정 및 문서
- `tailwind.config.js`, `postcss.config.js`
- `vitest.config.ts`, `playwright.config.ts`
- `.env.example`, `.gitignore`
- `.github/workflows/ci.yml` - GitHub Actions CI 파이프라인
- `vercel.json` - Vercel SPA 배포 설정
- `CLAUDE.md`, `PRD.md`, `TEST_STRATEGY.md`, `DEVELOPMENT_LOG.md`, `README.md`

### 기술적 결정 사항

#### AI 프롬프트 설계
- 각 단계별 시스템 프롬프트에 한국 의료 도메인 특화 지시사항 포함
- 심평원, 의료법, 개인정보보호법 구체적 조항 참조
- 출력 형식을 JSON으로 강제하여 파싱 안정성 확보
- `extractJSON` 헬퍼로 JSON 외 텍스트가 포함된 응답도 처리

#### 컴포넌트 설계 원칙
- 모든 컴포넌트는 props를 통한 순수 렌더링 또는 `useAppContext` 훅으로 상태 접근
- 인터랙티브 요소에 `aria-label` 속성 추가 (접근성)
- Tailwind CSS 클래스로 일관된 다크 테마 구현

### 다음 단계 (Next Steps)
- [x] `package.json`에 `test`, `test:coverage`, `test:e2e` 스크립트 추가
- [ ] CI 환경에서 테스트 실행 검증
- [x] Vercel 배포 설정 완료
- [ ] 실제 API 키로 엔드-투-엔드 기능 검증

---

---

## Session 3: 품질 개선 및 배포
**날짜**: 2026-03-13
**작업자**: 개발팀

### 완료된 작업
- Tailwind CSS v4 PostCSS 설정 수정 (`@tailwindcss/postcss` 패키지 적용)
- TypeScript 타입 에러 수정 (exporters.test.ts의 mock 타입)
- Vitest 설정에 E2E 파일 제외 규칙 추가 (`exclude: ['e2e/**']`)
- ESLint 에러 3개 수정:
  - `coverage/` 디렉토리 ESLint 제외
  - `AppContext.tsx` react-refresh 경고 suppression
  - `exportFlow.test.tsx` any 타입 제거
- Claude 모델 업데이트: `claude-opus-4-5` → `claude-opus-4-6`
- GitHub 레포 생성 및 초기 커밋 push
- 프로덕션 빌드 검증 (`npm run build` 성공)

### 최종 상태
- **단위/통합 테스트**: 73개 전체 통과 ✅
- **E2E 테스트**: 11개 전체 통과 ✅
- **커버리지**: 93.23% (기준 70% 초과) ✅
- **TypeScript**: 타입 에러 0개 ✅
- **ESLint**: 에러 0개 ✅
- **빌드**: 프로덕션 빌드 성공 ✅
- **GitHub**: https://github.com/jjh6841-hub/qa-scenario-forge ✅
- **GitHub Pages**: https://jjh6841-hub.github.io/qa-scenario-forge/ ✅
- **CI Pipeline**: 모든 스텝 통과 ✅

---

---

## Session 4: UI 개선 및 데모 모드 추가
**날짜**: 2026-03-13
**작업자**: 개발팀

### 완료된 작업

#### 데모 모드 (LOAD_DEMO)
- `src/types/index.ts`: `AppAction` 유니온 타입에 `{ type: 'LOAD_DEMO' }` 추가
- `src/context/AppContext.tsx`: `LOAD_DEMO` 리듀서 케이스 추가 — `mockRisks`, `mockScenarios`, `mockCases`, `mockPlaywrightFiles`를 가져와 4개 스테이지를 `'complete'` 상태로 즉시 설정. `isAnalyzing: false`, `activeTab: 'risks'` 함께 설정.

#### 입력 패널 개선
- `src/components/input/InputPanel.tsx`: API 키 없이도 결과를 미리 확인하는 "⚡ 데모 실행 (API 키 불필요)" 버튼 추가. 인디고→퍼플 그라디언트, 분석 중이거나 결과가 이미 있을 때는 숨김 처리.

#### 헤더 전면 재설계
- `src/components/layout/Header.tsx`: 다크 그라디언트 배경, 쉴드 아이콘에 블루/인디고/퍼플 그라디언트 글로우 추가, 타이틀 그라디언트 텍스트 적용, 하단 미세 경계선(`border-gray-800`), 배지 스타일 개선 및 "Claude AI 기반" 배지 추가.

#### EmptyState 컴포넌트 신규 생성
- `src/components/results/EmptyState.tsx`: 분석 결과 없을 때 표시되는 인상적인 시작 화면. 2×2 피처 카드 그리드(리스크 분석, 시나리오 생성, 테스트 케이스, Playwright 코드), 데모 힌트 텍스트 포함.

#### 결과 패널 업데이트
- `src/components/results/ResultsPanel.tsx`: 모든 스테이지 `idle` + 분석 중 아닐 때 `EmptyState` 렌더링, 그 외 `TabContainer` 및 기존 결과 UI 렌더링.

#### AnalyzeButton 개선
- `src/components/input/AnalyzeButton.tsx`: 블루→인디고 그라디언트 배경, 호버 시 섀도우 글로우(`hover:shadow-blue-500/25`), 분석 중 펄스 애니메이션, 텍스트에 ✨ 이모지 추가.

#### CSS 유틸리티 추가
- `src/index.css`: `.gradient-border`, `.glow-blue`, `.card-hover`, `.feature-card` 커스텀 클래스 추가.

#### PresetSelector 개선
- `src/components/input/PresetSelector.tsx`: 각 프리셋에 이모지 아이콘(💊 처방, 🔐 로그인, 📋 진료기록), 활성 상태에 그라디언트 배경 및 화살표 인디케이터 추가.

#### ExportBar 개선
- `src/components/results/ExportBar.tsx`: JSON 버튼 블루 그라디언트, Markdown 버튼 그린 그라디언트로 더 눈에 띄는 스타일링.

### 기술적 결정 사항
- 데모 모드는 `test/mocks/apiFixtures.ts`의 실제 목 데이터를 사용하여 프로덕션 코드와 테스트 목 데이터를 재사용
- `EmptyState`는 판정단이 처음 보는 화면이므로 시각적 임팩트에 집중

---

## 파일 생성 요약

| 카테고리 | 파일 수 |
|---|---|
| 설정 파일 | 8 |
| TypeScript 소스 | 28 |
| React 컴포넌트 | 20 |
| 테스트 파일 | 17 |
| 문서 파일 | 5 |
| CI/CD | 2 |
| **합계** | **80** |
