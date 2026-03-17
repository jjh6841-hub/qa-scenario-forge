import { useAppContext } from '../../context/AppContext';
import type { ActiveTab } from '../../types';

interface FeatureCard {
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  tab: ActiveTab;
}

const featureCards: FeatureCard[] = [
  {
    icon: '🎯',
    iconBg: 'bg-red-900/60 border border-red-700/50',
    title: '리스크 분석',
    description: 'AI가 잠재적 위험 요소를 식별하고 5×5 히트맵으로 시각화',
    tab: 'risks',
  },
  {
    icon: '📋',
    iconBg: 'bg-blue-900/60 border border-blue-700/50',
    title: '시나리오 생성',
    description: '리스크 기반 테스트 시나리오를 자동 생성',
    tab: 'scenarios',
  },
  {
    icon: '✅',
    iconBg: 'bg-green-900/60 border border-green-700/50',
    title: '테스트 케이스',
    description: '단계별 상세 테스트 케이스와 우선순위 자동 산출',
    tab: 'cases',
  },
  {
    icon: '🤖',
    iconBg: 'bg-purple-900/60 border border-purple-700/50',
    title: 'Playwright 코드',
    description: '실행 가능한 E2E 자동화 코드 즉시 생성',
    tab: 'code',
  },
];

const pipelineSteps = [
  { icon: '📄', label: '명세 입력', color: 'text-gray-300', bg: 'bg-gray-800 border-gray-700' },
  { icon: '🎯', label: '리스크 분석', color: 'text-red-400', bg: 'bg-red-900/40 border-red-700/50' },
  { icon: '📋', label: '시나리오 생성', color: 'text-blue-400', bg: 'bg-blue-900/40 border-blue-700/50' },
  { icon: '✅', label: '케이스 생성', color: 'text-green-400', bg: 'bg-green-900/40 border-green-700/50' },
  { icon: '🤖', label: '코드 생성', color: 'text-purple-400', bg: 'bg-purple-900/40 border-purple-700/50' },
];

export function EmptyState() {
  const { dispatch } = useAppContext();

  const handleCardClick = (tab: ActiveTab) => {
    dispatch({ type: 'LOAD_DEMO' });
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  };

  return (
    <div className="flex flex-col px-4 py-8 gap-8">

      {/* Hero */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/30 mb-4">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" aria-hidden="true">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" fill="currentColor" opacity="0.9" />
            <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
          AI가 의료 EMR QA를 자동화합니다
        </h2>
        <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
          기능 명세서를 입력하면 리스크 분석부터 Playwright 자동화 코드까지 4단계로 즉시 생성합니다
        </p>
      </div>

      {/* Pipeline flow */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 text-center">분석 파이프라인</p>
        <div className="flex items-center justify-center gap-0">
          {pipelineSteps.map((step, i) => (
            <div key={step.label} className="flex items-center">
              <div className={`flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl border ${step.bg} min-w-[72px]`}>
                <span className="text-lg">{step.icon}</span>
                <span className={`text-xs font-medium ${step.color} text-center leading-tight`}>{step.label}</span>
              </div>
              {i < pipelineSteps.length - 1 && (
                <div className="flex items-center mx-1">
                  <div className="w-4 h-px bg-gray-700" />
                  <svg className="w-3 h-3 text-gray-600 -ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-800" />
        <span className="text-xs text-gray-600">결과 미리보기</span>
        <div className="h-px flex-1 bg-gray-800" />
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-2 gap-3">
        {featureCards.map((card) => (
          <button
            key={card.title}
            onClick={() => handleCardClick(card.tab)}
            className="text-left bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-col gap-3 hover:border-gray-500 hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-lg ${card.iconBg}`}>
              {card.icon}
            </div>
            <div>
              <h3 className="text-gray-100 font-semibold text-sm mb-1">{card.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{card.description}</p>
            </div>
          </button>
        ))}
      </div>

      <p className="text-gray-600 text-xs text-center -mt-4">
        ↑ 카드를 클릭하면 데모 결과를 바로 확인합니다
      </p>

    </div>
  );
}
