import { useAppContext } from '../../context/AppContext';
import { presets } from '../../data/presets';

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
          return (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset.spec)}
              className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-blue-900 border-blue-500 text-blue-100'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="font-medium">{preset.label}</div>
              <div className="text-xs mt-0.5 opacity-70">{preset.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
