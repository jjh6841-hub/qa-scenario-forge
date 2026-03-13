import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { PlaywrightFile } from '../../../types';

interface PlaywrightCodeTabProps {
  files: PlaywrightFile[];
}

export function PlaywrightCodeTab({ files }: PlaywrightCodeTabProps) {
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentFile = files[activeFile];

  const handleCopy = async () => {
    if (!currentFile) return;
    try {
      await navigator.clipboard.writeText(currentFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = currentFile.code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (files.length === 0) return null;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
      {/* File tabs */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-700 bg-gray-900 overflow-x-auto">
        {files.map((file, index) => (
          <button
            key={file.filename}
            onClick={() => setActiveFile(index)}
            className={`px-3 py-1.5 rounded text-xs font-mono whitespace-nowrap transition-colors ${
              index === activeFile
                ? 'bg-blue-900 text-blue-200 border border-blue-700'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            {file.filename}
          </button>
        ))}
        <div className="ml-auto shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-400">복사됨</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                복사
              </>
            )}
          </button>
        </div>
      </div>

      {/* File description */}
      {currentFile && (
        <div className="px-4 py-2 bg-gray-900/50 border-b border-gray-700">
          <p className="text-gray-400 text-xs">{currentFile.description}</p>
        </div>
      )}

      {/* Code content */}
      {currentFile && (
        <div className="max-h-[500px] overflow-auto">
          <SyntaxHighlighter
            language="typescript"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              background: '#1e1e1e',
              fontSize: '12px',
            }}
            showLineNumbers
            lineNumberStyle={{ color: '#555', minWidth: '2.5em' }}
          >
            {currentFile.code}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
}
