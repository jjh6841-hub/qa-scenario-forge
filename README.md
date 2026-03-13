# QA Scenario Forge

**의료 EMR 특화 AI QA 도구** - Claude AI를 활용하여 한국 의료 EMR 기능 명세서에서 QA 시나리오, 테스트 케이스, Playwright 자동화 코드를 자동 생성합니다.

## 주요 기능

- **리스크 분석**: 기능 명세서를 분석하여 환자 안전, 규정 준수, 데이터 무결성 등 의료 도메인 리스크 자동 식별
- **시나리오 생성**: 식별된 리스크를 기반으로 테스트 시나리오 자동 생성 (심평원, 의료법, 개인정보보호법 반영)
- **테스트 케이스**: 단계별 상세 테스트 케이스 자동 작성 (우선순위 및 자동화 가능 여부 포함)
- **Playwright 코드**: 자동화 테스트 코드 자동 생성 (TypeScript, Page Object Model)
- **내보내기**: JSON 및 Markdown 형식으로 결과 다운로드

## 빠른 시작 (Quick Start)

### 사전 요구사항

- Node.js 20+
- Anthropic API 키 (Claude 접근 권한)

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/your-org/qa-scenario-forge.git
cd qa-scenario-forge

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일에 VITE_ANTHROPIC_API_KEY 설정

# 개발 서버 시작
npm run dev
```

브라우저에서 `http://localhost:5173` 열기

## 환경 변수 설정

`.env` 파일 생성:

```
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...
```

`.env.example` 파일을 참고하세요.

> **주의**: 이 앱은 브라우저에서 직접 Anthropic API를 호출합니다 (`dangerouslyAllowBrowser: true`). 프로덕션 환경에서는 API 키 보호를 위한 백엔드 프록시 서버 사용을 권장합니다.

## 사용 방법

1. **프리셋 선택** 또는 직접 기능 명세서 입력
2. **"QA 시나리오 분석 시작"** 버튼 클릭
3. 4단계 파이프라인이 순차적으로 실행됨:
   - 리스크 분석 → 시나리오 생성 → 케이스 생성 → 코드 생성
4. 각 탭에서 결과 확인
5. JSON 또는 Markdown으로 내보내기

## 기술 스택 (Tech Stack)

| 카테고리 | 기술 |
|---|---|
| 프레임워크 | React 19 + TypeScript 5.9 |
| 빌드 도구 | Vite 8 |
| 스타일링 | Tailwind CSS v4 |
| AI | Anthropic Claude API (`@anthropic-ai/sdk`) |
| 상태 관리 | React Context + useReducer |
| 코드 하이라이팅 | react-syntax-highlighter (Prism) |
| 단위/통합 테스트 | Vitest + React Testing Library |
| E2E 테스트 | Playwright |
| CI/CD | GitHub Actions |
| 배포 | Vercel |

## 테스트 명령어 (Test Commands)

```bash
# 단위/통합 테스트 실행
npm run test

# 감시 모드로 실행
npm run test -- --watch

# 커버리지 포함 실행
npm run test:coverage

# E2E 테스트 실행
npm run test:e2e

# 특정 E2E 테스트 파일만 실행
npx playwright test e2e/presets.spec.ts

# 빌드
npm run build

# 린트
npm run lint
```

## 프로젝트 구조 (Project Structure)

```
qa-scenario-forge/
├── src/
│   ├── types/          # TypeScript 타입 정의
│   ├── data/           # 프리셋 및 AI 프롬프트 데이터
│   ├── context/        # React Context (전역 상태)
│   ├── api/            # Anthropic API 연동
│   ├── hooks/          # 커스텀 훅 (파이프라인 오케스트레이션)
│   ├── utils/          # 유틸리티 함수
│   ├── components/
│   │   ├── common/     # 공통 컴포넌트 (Badge, Spinner)
│   │   ├── layout/     # 레이아웃 (Header, AppLayout)
│   │   ├── input/      # 입력 패널 컴포넌트
│   │   ├── pipeline/   # 파이프라인 진행 표시기
│   │   └── results/    # 결과 표시 컴포넌트
│   └── test/
│       ├── mocks/      # 테스트 픽스처 데이터
│       ├── utils/      # 유틸리티 단위 테스트
│       ├── components/ # 컴포넌트 단위 테스트
│       └── integration/# 통합 테스트
├── e2e/                # Playwright E2E 테스트
├── .github/workflows/  # CI/CD 설정
├── CLAUDE.md           # 개발 가이드 (Claude Code용)
├── PRD.md              # 제품 요구사항 문서
├── TEST_STRATEGY.md    # 테스트 전략 문서
└── DEVELOPMENT_LOG.md  # 개발 로그
```

## 도메인 특화 기능

이 도구는 한국 의료 EMR 도메인에 특화되어 있습니다:

- **심평원 규정**: DUR(Drug Utilization Review), 급여 청구 규정
- **의료법**: 처방전 작성(제18조), 기록 열람(제21조), 보존(제22조)
- **개인정보보호법**: 민감정보 처리(제23조), 안전성 확보(제29조)
- **HL7 FHIR**: 기관 간 진료 정보 교류 표준

## 기여 (Contributing)

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

테스트 커버리지 70% 유지 필수.

## 라이선스 (License)

MIT License
