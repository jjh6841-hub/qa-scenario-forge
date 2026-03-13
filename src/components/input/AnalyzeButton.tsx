import { Spinner } from '../common/Spinner';

interface AnalyzeButtonProps {
  specText: string;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

export function AnalyzeButton({ specText, isAnalyzing, onAnalyze }: AnalyzeButtonProps) {
  const isDisabled = !specText.trim() || isAnalyzing;

  return (
    <button
      onClick={onAnalyze}
      disabled={isDisabled}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-150 bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
    >
      {isAnalyzing ? (
        <>
          <Spinner size="sm" color="text-white" />
          <span>분석 중...</span>
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          <span>QA 시나리오 분석 시작</span>
        </>
      )}
    </button>
  );
}
