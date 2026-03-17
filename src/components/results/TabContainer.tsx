import { useAppContext } from '../../context/AppContext';
import type { ActiveTab } from '../../types';
import { RiskHeatmap } from './risk/RiskHeatmap';
import { RiskSummaryList } from './risk/RiskSummaryList';
import { ScenarioCard } from './scenarios/ScenarioCard';
import { TestCaseTable } from './cases/TestCaseTable';
import { PlaywrightCodeTab } from './code/PlaywrightCodeTab';
import { Spinner } from '../common/Spinner';

interface TabConfig {
  key: ActiveTab;
  label: string;
  stageKey: 'risks' | 'scenarios' | 'cases' | 'code';
}

const TABS: TabConfig[] = [
  { key: 'risks', label: '리스크 분석', stageKey: 'risks' },
  { key: 'scenarios', label: '시나리오', stageKey: 'scenarios' },
  { key: 'cases', label: '테스트 케이스', stageKey: 'cases' },
  { key: 'code', label: '코드', stageKey: 'code' },
];

function LoadingState({ message, streamingText }: { message: string; streamingText?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className="flex flex-col items-center py-8 gap-3"
    >
      <div className="flex items-center gap-2">
        <Spinner size="sm" color="text-blue-500" />
        <p className="text-gray-400 text-sm">{message}</p>
      </div>
      {streamingText && (
        <div className="w-full mt-2 p-3 bg-gray-800 rounded-lg border border-gray-700 max-h-48 overflow-y-auto">
          <pre className="text-xs text-gray-400 whitespace-pre-wrap break-words font-mono leading-relaxed">
            {streamingText}
            <span className="inline-block w-1.5 h-3.5 bg-blue-400 ml-0.5 animate-pulse" />
          </pre>
        </div>
      )}
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center py-16 gap-3"
    >
      <div className="w-12 h-12 rounded-full bg-red-900/50 flex items-center justify-center">
        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <p className="text-red-400 text-sm font-medium">오류가 발생했습니다</p>
      <p className="text-gray-500 text-xs max-w-sm text-center">{message}</p>
    </div>
  );
}

function IdleState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <p className="text-gray-500 text-sm">분석을 시작하면 결과가 여기에 표시됩니다</p>
    </div>
  );
}

export function TabContainer() {
  const { state, dispatch } = useAppContext();
  const { results, activeTab } = state;

  const handleTabClick = (tab: ActiveTab) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  };

  function getBadgeCount(tab: TabConfig): number | null {
    const stage = results[tab.stageKey];
    if (stage.status !== 'complete' || !stage.data) return null;
    return (stage.data as unknown[]).length;
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
      {/* Tab headers */}
      <div
        role="tablist"
        aria-label="분석 결과 탭"
        className="flex border-b border-gray-700 bg-gray-900"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = getBadgeCount(tab);
          const stageStatus = results[tab.stageKey].status;

          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.key}`}
              id={`tab-${tab.key}`}
              onClick={() => handleTabClick(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-medium transition-colors border-b-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
                isActive
                  ? 'border-blue-500 text-blue-400 bg-gray-800'
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
              }`}
            >
              {stageStatus === 'processing' && (
                <Spinner size="sm" color="text-blue-400" />
              )}
              <span>{tab.label}</span>
              {count !== null && (
                <span className="px-1.5 py-0.5 rounded-full text-xs bg-blue-900 text-blue-300">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="p-4">
        <div
          role="tabpanel"
          id="tabpanel-risks"
          aria-labelledby="tab-risks"
          hidden={activeTab !== 'risks'}
        >
          {results.risks.status === 'idle' && <IdleState />}
          {results.risks.status === 'processing' && (
            <LoadingState message="리스크를 분석하고 있습니다..." streamingText={results.risks.streamingText} />
          )}
          {results.risks.status === 'error' && (
            <ErrorState message={results.risks.error ?? '알 수 없는 오류'} />
          )}
          {results.risks.status === 'complete' && results.risks.data && (
            <>
              <RiskHeatmap risks={results.risks.data} />
              <RiskSummaryList risks={results.risks.data} />
            </>
          )}
        </div>

        <div
          role="tabpanel"
          id="tabpanel-scenarios"
          aria-labelledby="tab-scenarios"
          hidden={activeTab !== 'scenarios'}
        >
          {results.scenarios.status === 'idle' && <IdleState />}
          {results.scenarios.status === 'processing' && (
            <LoadingState message="테스트 시나리오를 생성하고 있습니다..." streamingText={results.scenarios.streamingText} />
          )}
          {results.scenarios.status === 'error' && (
            <ErrorState message={results.scenarios.error ?? '알 수 없는 오류'} />
          )}
          {results.scenarios.status === 'complete' && results.scenarios.data && (
            <div className="space-y-3">
              {results.scenarios.data.map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  risks={results.risks.data ?? []}
                />
              ))}
            </div>
          )}
        </div>

        <div
          role="tabpanel"
          id="tabpanel-cases"
          aria-labelledby="tab-cases"
          hidden={activeTab !== 'cases'}
        >
          {results.cases.status === 'idle' && <IdleState />}
          {results.cases.status === 'processing' && (
            <LoadingState message="테스트 케이스를 작성하고 있습니다..." streamingText={results.cases.streamingText} />
          )}
          {results.cases.status === 'error' && (
            <ErrorState message={results.cases.error ?? '알 수 없는 오류'} />
          )}
          {results.cases.status === 'complete' && results.cases.data && (
            <TestCaseTable cases={results.cases.data} />
          )}
        </div>

        <div
          role="tabpanel"
          id="tabpanel-code"
          aria-labelledby="tab-code"
          hidden={activeTab !== 'code'}
        >
          {results.code.status === 'idle' && <IdleState />}
          {results.code.status === 'processing' && (
            <LoadingState message="Playwright 자동화 코드를 생성하고 있습니다..." streamingText={results.code.streamingText} />
          )}
          {results.code.status === 'error' && (
            <ErrorState message={results.code.error ?? '알 수 없는 오류'} />
          )}
          {results.code.status === 'complete' && results.code.data && (
            <PlaywrightCodeTab files={results.code.data} />
          )}
        </div>
      </div>
    </div>
  );
}
