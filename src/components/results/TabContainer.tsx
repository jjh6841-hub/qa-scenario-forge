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

function SkeletonLine({ w = 'w-full', h = 'h-3' }: { w?: string; h?: string }) {
  return <div className={`${w} ${h} bg-gray-700 rounded animate-pulse`} />;
}

function RiskSkeleton({ streamingText }: { streamingText?: string }) {
  const found = streamingText ? (streamingText.match(/"priority"\s*:/g) ?? []).length : 0;
  const rows = Math.max(4, found + 1);
  const priorities = ['critical', 'high', 'medium', 'low'];
  const priorityColors: Record<string, string> = {
    critical: 'bg-red-900/60 border-red-700',
    high: 'bg-orange-900/60 border-orange-700',
    medium: 'bg-yellow-900/60 border-yellow-700',
    low: 'bg-blue-900/60 border-blue-700',
  };

  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => {
        const p = priorities[i % 4];
        return (
          <div key={i} className={`rounded-lg border p-4 ${priorityColors[p]}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-16 h-5 bg-gray-600 rounded-full animate-pulse" />
              <SkeletonLine w="w-48" h="h-4" />
            </div>
            <SkeletonLine w="w-full" />
            <div className="mt-1.5">
              <SkeletonLine w="w-3/4" />
            </div>
            <div className="flex gap-4 mt-3">
              <SkeletonLine w="w-20" h="h-3" />
              <SkeletonLine w="w-20" h="h-3" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ScenarioSkeleton({ streamingText }: { streamingText?: string }) {
  const found = streamingText ? (streamingText.match(/"type"\s*:/g) ?? []).length : 0;
  const rows = Math.max(3, found + 1);
  const typeColors = ['bg-purple-900/40 border-purple-700', 'bg-green-900/40 border-green-700', 'bg-blue-900/40 border-blue-700'];

  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`rounded-lg border p-4 ${typeColors[i % 3]}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-14 h-5 bg-gray-600 rounded-full animate-pulse" />
              <SkeletonLine w="w-40" h="h-4" />
            </div>
            <div className="w-20 h-5 bg-gray-700 rounded-full animate-pulse" />
          </div>
          <SkeletonLine w="w-full" />
          <div className="mt-1.5">
            <SkeletonLine w="w-5/6" />
          </div>
          <div className="mt-3 space-y-1.5">
            <SkeletonLine w="w-3/4" h="h-2.5" />
            <SkeletonLine w="w-2/3" h="h-2.5" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CasesSkeleton({ streamingText }: { streamingText?: string }) {
  const found = streamingText ? (streamingText.match(/"automatable"\s*:/g) ?? []).length : 0;
  const rows = Math.max(4, found + 1);

  return (
    <div className="rounded-lg border border-gray-700 overflow-hidden">
      <div className="grid grid-cols-12 bg-gray-800 px-4 py-2 border-b border-gray-700">
        <div className="col-span-1"><SkeletonLine w="w-8" h="h-3" /></div>
        <div className="col-span-5"><SkeletonLine w="w-24" h="h-3" /></div>
        <div className="col-span-2"><SkeletonLine w="w-12" h="h-3" /></div>
        <div className="col-span-2"><SkeletonLine w="w-14" h="h-3" /></div>
        <div className="col-span-2"><SkeletonLine w="w-16" h="h-3" /></div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-12 px-4 py-3 border-b border-gray-800 items-center">
          <div className="col-span-1"><SkeletonLine w="w-10" h="h-3" /></div>
          <div className="col-span-5 space-y-1.5">
            <SkeletonLine w="w-full" h="h-3" />
            <SkeletonLine w="w-2/3" h="h-2.5" />
          </div>
          <div className="col-span-2"><div className="w-8 h-5 bg-gray-700 rounded animate-pulse" /></div>
          <div className="col-span-2"><div className="w-6 h-5 bg-gray-700 rounded animate-pulse" /></div>
          <div className="col-span-2"><div className="w-16 h-5 bg-gray-700 rounded animate-pulse" /></div>
        </div>
      ))}
    </div>
  );
}

function CodeSkeleton({ streamingText }: { streamingText?: string }) {
  const found = streamingText ? (streamingText.match(/"filename"\s*:/g) ?? []).length : 0;
  const files = Math.max(1, found + 1);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {Array.from({ length: files }).map((_, i) => (
          <div key={i} className="w-40 h-8 bg-gray-700 rounded-t-lg animate-pulse" />
        ))}
      </div>
      <div className="rounded-lg bg-gray-950 border border-gray-700 p-4 space-y-2">
        {[100, 85, 60, 90, 45, 70, 55, 80, 40, 65, 50, 75].map((w, i) => (
          <div key={i} className="flex gap-3 items-center">
            <div className="w-6 h-2.5 bg-gray-800 rounded shrink-0" />
            <div
              className="h-2.5 bg-gray-700 rounded animate-pulse"
              style={{ width: `${w}%`, animationDelay: `${i * 60}ms` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingHeader({ message, isStreaming }: { message: string; isStreaming: boolean }) {
  return (
    <div role="status" aria-live="polite" aria-label={message} className="flex items-center gap-2 mb-4">
      <Spinner size="sm" color="text-blue-500" />
      <p className="text-gray-400 text-sm">
        {message}
        {isStreaming && <span className="ml-1 text-blue-400 animate-pulse">●</span>}
      </p>
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
            <>
              <LoadingHeader message="리스크를 분석하고 있습니다..." isStreaming={!!results.risks.streamingText} />
              <RiskSkeleton streamingText={results.risks.streamingText} />
            </>
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
            <>
              <LoadingHeader message="테스트 시나리오를 생성하고 있습니다..." isStreaming={!!results.scenarios.streamingText} />
              <ScenarioSkeleton streamingText={results.scenarios.streamingText} />
            </>
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
            <>
              <LoadingHeader message="테스트 케이스를 작성하고 있습니다..." isStreaming={!!results.cases.streamingText} />
              <CasesSkeleton streamingText={results.cases.streamingText} />
            </>
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
            <>
              <LoadingHeader message="Playwright 자동화 코드를 생성하고 있습니다..." isStreaming={!!results.code.streamingText} />
              <CodeSkeleton streamingText={results.code.streamingText} />
            </>
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
