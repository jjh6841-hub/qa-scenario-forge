import type { RiskItem } from '../../../types';
import { Badge } from '../../common/Badge';
import { getPriorityColor, calculateRiskScore } from '../../../utils/riskColors';

interface RiskSummaryListProps {
  risks: RiskItem[];
}

const PRIORITY_LABELS: Record<RiskItem['priority'], string> = {
  critical: '위험',
  high: '높음',
  medium: '보통',
  low: '낮음',
};

export function RiskSummaryList({ risks }: RiskSummaryListProps) {
  const sorted = [...risks].sort((a, b) => {
    const scoreA = calculateRiskScore(a.impact, a.likelihood);
    const scoreB = calculateRiskScore(b.impact, b.likelihood);
    return scoreB - scoreA;
  });

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mt-4">
      <h3 className="text-gray-200 text-sm font-semibold mb-3">
        리스크 목록 ({risks.length}개)
      </h3>
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {sorted.map((risk) => (
          <div
            key={risk.id}
            className="bg-gray-900 border border-gray-700 rounded-lg p-3 hover:border-gray-500 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span className="text-gray-500 text-xs font-mono shrink-0">{risk.id}</span>
                <Badge label={risk.category} color="bg-gray-700 text-gray-300 border border-gray-600" />
                <Badge
                  label={PRIORITY_LABELS[risk.priority]}
                  color={getPriorityColor(risk.priority)}
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 bg-gray-800 px-2 py-0.5 rounded text-xs">
                  <span className="text-gray-500">영향</span>
                  <span className="text-orange-400 font-bold">{risk.impact}</span>
                </div>
                <div className="flex items-center gap-1 bg-gray-800 px-2 py-0.5 rounded text-xs">
                  <span className="text-gray-500">가능성</span>
                  <span className="text-blue-400 font-bold">{risk.likelihood}</span>
                </div>
                <div className="flex items-center gap-1 bg-gray-800 px-2 py-0.5 rounded text-xs">
                  <span className="text-gray-500">점수</span>
                  <span className="text-white font-bold">
                    {calculateRiskScore(risk.impact, risk.likelihood)}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-200 text-sm font-medium">{risk.title}</p>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">{risk.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
