import { useAppContext } from '../../context/AppContext';
import { useAnalysisPipeline } from '../../hooks/useAnalysisPipeline';
import { PresetSelector } from './PresetSelector';
import { SpecTextArea } from './SpecTextArea';
import { AnalyzeButton } from './AnalyzeButton';

export function InputPanel() {
  const { state, dispatch } = useAppContext();
  const { runAnalysis } = useAnalysisPipeline();

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  const handleLoadDemo = () => {
    dispatch({ type: 'LOAD_DEMO' });
  };

  const allIdle =
    state.results.risks.status === 'idle' &&
    state.results.scenarios.status === 'idle' &&
    state.results.cases.status === 'idle' &&
    state.results.code.status === 'idle';

  const showDemoButton = !state.isAnalyzing && allIdle;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-200 font-semibold text-sm">입력 패널</h2>
        {(state.specText || state.results.risks.status !== 'idle') && (
          <button
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
          >
            초기화
          </button>
        )}
      </div>

      <PresetSelector />
      <SpecTextArea />

      {showDemoButton && (
        <div className="mb-3">
          <button
            data-testid="demo-button"
            onClick={handleLoadDemo}
            className="w-full flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-150 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <span className="font-semibold">⚡ 데모 실행 (API 키 불필요)</span>
            <span className="text-xs font-normal opacity-80">실제 EMR 분석 결과 미리보기</span>
          </button>
        </div>
      )}

      <AnalyzeButton
        specText={state.specText}
        isAnalyzing={state.isAnalyzing}
        onAnalyze={runAnalysis}
      />

    </div>
  );
}
