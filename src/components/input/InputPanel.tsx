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
      <AnalyzeButton
        specText={state.specText}
        isAnalyzing={state.isAnalyzing}
        onAnalyze={runAnalysis}
      />

      {!import.meta.env.VITE_ANTHROPIC_API_KEY && (
        <div className="mt-3 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
          <p className="text-yellow-400 text-xs">
            <span className="font-medium">API 키 미설정:</span>{' '}
            <code className="bg-yellow-900/50 px-1 rounded">.env</code> 파일에{' '}
            <code className="bg-yellow-900/50 px-1 rounded">VITE_ANTHROPIC_API_KEY</code>를
            설정하세요.
          </p>
        </div>
      )}
    </div>
  );
}
