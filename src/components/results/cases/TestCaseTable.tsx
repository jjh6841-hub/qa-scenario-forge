import { useState, Fragment } from 'react';
import type { TestCase } from '../../../types';
import { Badge } from '../../common/Badge';

interface TestCaseTableProps {
  cases: TestCase[];
}

const PRIORITY_COLORS: Record<TestCase['priority'], string> = {
  P1: 'bg-red-900 text-red-200 border border-red-700',
  P2: 'bg-yellow-900 text-yellow-200 border border-yellow-700',
  P3: 'bg-green-900 text-green-200 border border-green-700',
};

export function TestCaseTable({ cases }: TestCaseTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-gray-200 text-sm font-semibold">
          테스트 케이스 ({cases.length}개)
        </h3>
        <div className="flex gap-3 text-xs text-gray-500">
          <span>
            자동화 가능: {cases.filter((c) => c.automatable).length}개
          </span>
          <span>
            P1: {cases.filter((c) => c.priority === 'P1').length}개
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-900">
              <th className="px-4 py-2.5 text-left text-gray-400 text-xs font-medium uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-2.5 text-left text-gray-400 text-xs font-medium uppercase tracking-wider">
                제목
              </th>
              <th className="px-4 py-2.5 text-center text-gray-400 text-xs font-medium uppercase tracking-wider">
                단계
              </th>
              <th className="px-4 py-2.5 text-center text-gray-400 text-xs font-medium uppercase tracking-wider">
                우선순위
              </th>
              <th className="px-4 py-2.5 text-center text-gray-400 text-xs font-medium uppercase tracking-wider">
                자동화
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {cases.map((tc) => (
              <Fragment key={tc.id}>
                <tr
                  className="hover:bg-gray-700/50 cursor-pointer transition-colors"
                  onClick={() => toggleExpand(tc.id)}
                >
                  <td className="px-4 py-3 font-mono text-gray-400 text-xs whitespace-nowrap">
                    {tc.id}
                  </td>
                  <td className="px-4 py-3 text-gray-200 text-sm">
                    <div className="flex items-center gap-2">
                      <svg
                        className={`w-3 h-3 text-gray-500 transition-transform shrink-0 ${
                          expandedId === tc.id ? 'rotate-90' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      {tc.title}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-400 text-sm">
                    {tc.steps.length}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge label={tc.priority} color={PRIORITY_COLORS[tc.priority]} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {tc.automatable ? (
                      <span className="inline-flex items-center gap-1 text-green-400 text-xs">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        가능
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-500 text-xs">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        수동
                      </span>
                    )}
                  </td>
                </tr>
                {expandedId === tc.id && (
                  <tr key={`${tc.id}-expanded`}>
                    <td colSpan={5} className="px-4 py-3 bg-gray-900/50">
                      <div className="space-y-2">
                        {tc.steps.map((step) => (
                          <div
                            key={step.order}
                            className="flex gap-3 text-xs bg-gray-800 rounded-lg p-3"
                          >
                            <div className="shrink-0 w-5 h-5 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center font-bold text-xs">
                              {step.order}
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-200 mb-1">{step.action}</p>
                              <p className="text-gray-400">
                                <span className="text-green-500 font-medium">→ </span>
                                {step.expectedResult}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
