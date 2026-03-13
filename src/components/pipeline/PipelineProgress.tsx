import { useAppContext } from '../../context/AppContext';
import type { StageStatus } from '../../types';

interface PipelineStep {
  label: string;
  key: string;
  stageKey?: 'risks' | 'scenarios' | 'cases' | 'code';
}

const STEPS: PipelineStep[] = [
  { label: '입력', key: 'input' },
  { label: '리스크 분석', key: 'risks', stageKey: 'risks' },
  { label: '시나리오 생성', key: 'scenarios', stageKey: 'scenarios' },
  { label: '케이스 생성', key: 'cases', stageKey: 'cases' },
  { label: '코드 생성', key: 'code', stageKey: 'code' },
];

function StepIcon({ status }: { status: StageStatus | 'input-complete' | 'idle' }) {
  if (status === 'complete' || status === 'input-complete') {
    return (
      <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (status === 'processing') {
    return (
      <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
        <svg
          className="w-4 h-4 text-white animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-gray-500" />
    </div>
  );
}

export function PipelineProgress() {
  const { state } = useAppContext();
  const { results, specText, isAnalyzing } = state;

  function getStepStatus(step: PipelineStep): StageStatus | 'input-complete' | 'idle' {
    if (step.key === 'input') {
      return specText.trim() ? 'input-complete' : 'idle';
    }
    if (step.stageKey) {
      return results[step.stageKey].status;
    }
    return 'idle';
  }

  const hasAnyActivity = isAnalyzing || Object.values(results).some((s) => s.status !== 'idle');

  if (!hasAnyActivity && !specText.trim()) return null;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 mb-4">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const status = getStepStatus(step);
          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <StepIcon status={status} />
                <span
                  className={`mt-1 text-xs whitespace-nowrap ${
                    status === 'processing'
                      ? 'text-blue-400 font-medium'
                      : status === 'complete' || status === 'input-complete'
                      ? 'text-green-400'
                      : status === 'error'
                      ? 'text-red-400'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`mx-1 h-0.5 w-8 md:w-12 lg:w-8 xl:w-12 ${
                    getStepStatus(STEPS[index + 1]) !== 'idle'
                      ? 'bg-blue-500'
                      : 'bg-gray-600'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
