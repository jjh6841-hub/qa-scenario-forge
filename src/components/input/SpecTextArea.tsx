import { useAppContext } from '../../context/AppContext';

export function SpecTextArea() {
  const { state, dispatch } = useAppContext();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'SET_SPEC_TEXT', payload: e.target.value });
  };

  return (
    <div className="mb-4">
      <label
        htmlFor="spec-textarea"
        className="block text-gray-400 text-xs font-medium uppercase tracking-wider mb-2"
      >
        기능 명세서 입력
      </label>
      <textarea
        id="spec-textarea"
        value={state.specText}
        onChange={handleChange}
        disabled={state.isAnalyzing}
        rows={16}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-gray-200 text-sm placeholder-gray-500 resize-y focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        placeholder={`의료 EMR 기능 명세서를 입력하세요.

예시:
## 처방 입력 화면 기능 명세서

### 1. 개요
처방 입력 화면은 의사가 환자에 대한 의약품 처방을 입력하고...

### 2. 주요 기능
- DUR 실시간 점검
- 보험 분류 자동 처리
- 처방전 출력 및 전송`}
      />
      <div className="mt-1 flex justify-between">
        <span className="text-gray-600 text-xs">
          위 프리셋 버튼을 클릭하거나 직접 입력하세요
        </span>
        <span className="text-gray-600 text-xs">
          {state.specText.length.toLocaleString()}자
        </span>
      </div>
    </div>
  );
}
