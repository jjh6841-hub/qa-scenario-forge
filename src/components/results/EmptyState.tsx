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

export function EmptyState() {
  const { dispatch } = useAppContext();

  const handleCardClick = (tab: ActiveTab) => {
    dispatch({ type: 'LOAD_DEMO' });
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-96 py-12 px-6">
      {/* Main title area */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/30 mb-5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-9 h-9 text-white"
            aria-hidden="true"
          >
            <path
              d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"
              fill="currentColor"
              opacity="0.9"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
          AI가 의료 EMR QA를 자동화합니다
        </h2>
        <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
          기능 명세서를 입력하거나 프리셋을 선택해 분석을 시작하세요
        </p>
      </div>

      {/* Feature cards 2x2 grid — clickable, loads demo */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-xl mb-4">
        {featureCards.map((card) => (
          <button
            key={card.title}
            onClick={() => handleCardClick(card.tab)}
            className="feature-card card-hover text-left bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-col gap-3 hover:border-gray-500 transition-colors cursor-pointer"
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl ${card.iconBg}`}>
              {card.icon}
            </div>
            <div>
              <h3 className="text-gray-100 font-semibold text-sm mb-1">{card.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{card.description}</p>
            </div>
          </button>
        ))}
      </div>

      <p className="text-gray-600 text-xs mb-8">
        ↑ 카드를 클릭하면 데모 결과를 바로 확인합니다
      </p>

      {/* Demo hint */}
      <div className="flex items-center gap-2 text-center">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-700" />
        <p className="text-gray-500 text-xs">
          데모를 실행하면 실제 분석 결과를 미리 확인할 수 있습니다
        </p>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-700" />
      </div>
    </div>
  );
}
