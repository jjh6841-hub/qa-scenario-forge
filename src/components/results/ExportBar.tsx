import { useAppContext } from '../../context/AppContext';
import { exportToJSON, exportToMarkdown } from '../../utils/exporters';

export function ExportBar() {
  const { state } = useAppContext();
  const { results, specText } = state;

  const hasResults =
    results.risks.status === 'complete' ||
    results.scenarios.status === 'complete' ||
    results.cases.status === 'complete' ||
    results.code.status === 'complete';

  if (!hasResults) return null;

  const handleExportJSON = () => {
    exportToJSON(results, specText);
  };

  const handleExportMarkdown = () => {
    exportToMarkdown(results, specText);
  };

  return (
    <div data-testid="export-bar" className="mt-4 flex items-center justify-end gap-2">
      <span className="text-gray-500 text-xs mr-2">결과 내보내기:</span>
      <button
        data-testid="export-json"
        onClick={handleExportJSON}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-gradient-to-r from-blue-700 to-blue-600 text-blue-100 hover:from-blue-600 hover:to-blue-500 border border-blue-600/50 hover:border-blue-500 transition-all shadow-sm hover:shadow-blue-500/20 hover:shadow-md"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        JSON 다운로드
      </button>
      <button
        data-testid="export-markdown"
        onClick={handleExportMarkdown}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-gradient-to-r from-green-700 to-green-600 text-green-100 hover:from-green-600 hover:to-green-500 border border-green-600/50 hover:border-green-500 transition-all shadow-sm hover:shadow-green-500/20 hover:shadow-md"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Markdown 다운로드
      </button>
    </div>
  );
}
