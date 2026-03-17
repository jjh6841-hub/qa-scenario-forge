export function Header() {
  return (
    <header className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-b border-gray-800 px-6 py-4">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Shield SVG logo with animated gradient glow */}
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-white"
              aria-hidden="true"
            >
              <path
                d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"
                fill="currentColor"
                opacity="0.9"
              />
              <path
                d="M9 12l2 2 4-4"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 opacity-20 blur-sm -z-10" />
          </div>

          <div>
            <h1
              className="text-lg font-bold leading-tight tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"
            >
              QA Scenario Forge
            </h1>
            <p className="text-gray-400 text-xs">의료 EMR 특화 AI QA 도구</p>
          </div>
        </div>

        {/* GC메디아이 로고 */}
        <div className="bg-white rounded-lg px-2.5 py-1 select-none" aria-label="GC메디아이">
          <img
            src={`${import.meta.env.BASE_URL}gc-logo.png`}
            alt="GC메디아이"
            className="h-6 w-auto"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex cursor-default select-none items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-900/60 text-blue-200 border border-blue-700/60 backdrop-blur-sm shadow-sm shadow-blue-900/30">
            <svg
              className="w-3 h-3 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            의료 EMR 도메인 특화
          </span>
          <span className="hidden lg:inline-flex cursor-default select-none items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-900/60 text-green-200 border border-green-700/60 backdrop-blur-sm shadow-sm shadow-green-900/30">
            <svg
              className="w-3 h-3 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            심평원 · 의료법 · 개인정보보호법
          </span>
          <span className="cursor-default select-none inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-900/60 text-purple-200 border border-purple-700/60 backdrop-blur-sm shadow-sm shadow-purple-900/30">
            <svg
              className="w-3 h-3 text-purple-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            Claude AI 기반
          </span>
        </div>
      </div>
    </header>
  );
}
