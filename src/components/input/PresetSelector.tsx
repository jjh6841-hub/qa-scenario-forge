import { useAppContext } from '../../context/AppContext';
import { presets } from '../../data/presets';

const presetEmojis: Record<string, string> = {
  'emr-prescription': '💊',
  'emr-login': '🔐',
  'emr-records': '📋',
};

export function PresetSelector() {
  const { state, dispatch } = useAppContext();

  const handlePresetClick = (spec: string) => {
    dispatch({ type: 'SET_SPEC_TEXT', payload: spec });
  };

  return (
    <div className="mb-4">
      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">
        프리셋 선택
      </p>
      <div className="flex flex-col gap-2">
        {presets.map((preset) => {
          const isActive = state.specText === preset.spec;
          const emoji = presetEmojis[preset.id] ?? '📄';
          return (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset.spec)}
              className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-all duration-150 flex items-center justify-between gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-blue-500 text-blue-100'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="flex items-start gap-2 min-w-0">
                <span className="text-base leading-none mt-0.5 flex-shrink-0">{emoji}</span>
                <div className="min-w-0">
                  <div className="font-medium truncate">{preset.label}</div>
                  <div className="text-xs mt-0.5 opacity-70 truncate">{preset.description}</div>
                </div>
              </div>
              {isActive && (
                <svg
                  className="w-4 h-4 text-blue-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
