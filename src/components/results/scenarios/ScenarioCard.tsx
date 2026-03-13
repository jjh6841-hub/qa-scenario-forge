import type { TestScenario, RiskItem } from '../../../types';
import { Badge } from '../../common/Badge';

interface ScenarioCardProps {
  scenario: TestScenario;
  risks: RiskItem[];
}

const TYPE_LABELS: Record<TestScenario['type'], string> = {
  functional: '기능',
  security: '보안',
  compliance: '규정 준수',
  performance: '성능',
  usability: '사용성',
};

const TYPE_COLORS: Record<TestScenario['type'], string> = {
  functional: 'bg-blue-900 text-blue-200 border border-blue-700',
  security: 'bg-red-900 text-red-200 border border-red-700',
  compliance: 'bg-purple-900 text-purple-200 border border-purple-700',
  performance: 'bg-orange-900 text-orange-200 border border-orange-700',
  usability: 'bg-green-900 text-green-200 border border-green-700',
};

export function ScenarioCard({ scenario, risks }: ScenarioCardProps) {
  const linkedRisks = risks.filter((r) => scenario.riskIds.includes(r.id));

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 hover:border-gray-500 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-gray-500 text-xs font-mono">{scenario.id}</span>
          <Badge label={TYPE_LABELS[scenario.type]} color={TYPE_COLORS[scenario.type]} />
        </div>
      </div>

      <h4 className="text-gray-100 text-sm font-semibold mb-2">{scenario.title}</h4>
      <p className="text-gray-400 text-xs leading-relaxed mb-3">{scenario.description}</p>

      {scenario.preconditions.length > 0 && (
        <div className="mb-3">
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1.5">
            사전 조건
          </p>
          <ul className="space-y-1">
            {scenario.preconditions.map((precondition, index) => (
              <li key={index} className="flex items-start gap-1.5 text-xs text-gray-400">
                <span className="text-blue-500 mt-0.5 shrink-0">•</span>
                {precondition}
              </li>
            ))}
          </ul>
        </div>
      )}

      {linkedRisks.length > 0 && (
        <div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1.5">
            관련 리스크
          </p>
          <div className="flex flex-wrap gap-1">
            {linkedRisks.map((risk) => (
              <span
                key={risk.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-800 border border-gray-600 rounded text-xs text-gray-300"
                title={risk.title}
              >
                <span className="text-gray-500 font-mono">{risk.id}</span>
                <span className="text-gray-400 max-w-24 truncate">{risk.title}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
