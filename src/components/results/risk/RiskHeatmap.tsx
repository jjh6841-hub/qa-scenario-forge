import type { RiskItem } from '../../../types';
import { getRiskColor } from '../../../utils/riskColors';

interface RiskHeatmapProps {
  risks: RiskItem[];
}

export function RiskHeatmap({ risks }: RiskHeatmapProps) {
  // Build a map of impact x likelihood -> risks
  const cellMap: Record<string, RiskItem[]> = {};
  for (const risk of risks) {
    const key = `${risk.impact}-${risk.likelihood}`;
    if (!cellMap[key]) cellMap[key] = [];
    cellMap[key].push(risk);
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
      <h3 className="text-gray-200 text-sm font-semibold mb-4">리스크 히트맵</h3>
      <div className="flex gap-4">
        {/* Y-axis label */}
        <div className="flex flex-col justify-between items-center py-2">
          <span className="text-gray-500 text-xs rotate-[-90deg] whitespace-nowrap mt-8">
            영향도 (Impact)
          </span>
        </div>

        <div className="flex-1">
          {/* Y-axis values (top = 5, bottom = 1) */}
          <div className="flex gap-1">
            <div className="flex flex-col gap-1 justify-between mr-1">
              {[5, 4, 3, 2, 1].map((impact) => (
                <div
                  key={impact}
                  className="w-4 h-10 flex items-center justify-center text-gray-500 text-xs"
                >
                  {impact}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex-1">
              <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                {[5, 4, 3, 2, 1].map((impact) =>
                  [1, 2, 3, 4, 5].map((likelihood) => {
                    const key = `${impact}-${likelihood}`;
                    const cellRisks = cellMap[key] ?? [];
                    const bgColor =
                      cellRisks.length > 0
                        ? getRiskColor(impact, likelihood)
                        : 'bg-gray-700 text-gray-600';

                    return (
                      <div
                        key={key}
                        className={`h-10 rounded flex items-center justify-center text-xs font-bold transition-all ${bgColor} ${
                          cellRisks.length > 0 ? 'animate-pop-in cursor-pointer' : ''
                        }`}
                        title={cellRisks.map((r) => r.title).join('\n')}
                      >
                        {cellRisks.length > 0 ? cellRisks.length : ''}
                      </div>
                    );
                  })
                )}
              </div>

              {/* X-axis values */}
              <div className="grid gap-1 mt-1" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                {[1, 2, 3, 4, 5].map((v) => (
                  <div key={v} className="h-4 flex items-center justify-center text-gray-500 text-xs">
                    {v}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* X-axis label */}
          <div className="text-center mt-1">
            <span className="text-gray-500 text-xs">발생가능성 (Likelihood)</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-600" />
          <span className="text-gray-400 text-xs">위험 (20-25)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-orange-500" />
          <span className="text-gray-400 text-xs">높음 (10-19)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-yellow-400" />
          <span className="text-gray-400 text-xs">보통 (6-9)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-200" />
          <span className="text-gray-400 text-xs">낮음 (1-5)</span>
        </div>
      </div>
    </div>
  );
}
