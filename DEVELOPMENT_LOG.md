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
- [ ] `package.json`에 `test`, `test:coverage`, `test:e2e` 스크립트 추가
- [ ] CI 환경에서 테스트 실행 검증
- [ ] Vercel 배포 설정 및 환경 변수 구성
- [ ] 실제 API 키로 엔드-투-엔드 기능 검증

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
