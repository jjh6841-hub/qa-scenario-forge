import type { RiskItem } from '../../types';
import { getDomainScores } from '../../utils/riskColors';

interface DomainScoreBarProps {
  risks: RiskItem[];
}

interface GaugeProps {
  label: string;
  score: number;
  color: string;
  trackColor: string;
}

function CircularGauge({ label, score, color, trackColor }: GaugeProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg
          viewBox="0 0 100 100"
          className="w-24 h-24 -rotate-90"
          aria-label={`${label}: ${score}점`}
        >
          {/* Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth="8"
          />
          {/* Progress */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s ease-out',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-xl font-bold"
            style={{ color }}
          >
            {score}
          </span>
          <span className="text-gray-500 text-xs">/ 100</span>
        </div>
      </div>
      <span className="text-gray-300 text-xs font-medium text-center">{label}</span>
    </div>
  );
}

export function DomainScoreBar({ risks }: DomainScoreBarProps) {
  const scores = getDomainScores(risks);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-4">
      <h3 className="text-gray-200 text-sm font-semibold mb-4">의료 도메인 위험 지수</h3>
      <div className="flex justify-around items-center">
        <CircularGauge
          label="환자 안전"
          score={scores.patientSafety}
          color="#ef4444"
          trackColor="#450a0a"
        />
        <CircularGauge
          label="규정 준수"
          score={scores.compliance}
          color="#f59e0b"
          trackColor="#451a03"
        />
        <CircularGauge
          label="데이터 무결성"
          score={scores.dataIntegrity}
          color="#3b82f6"
          trackColor="#172554"
        />
      </div>
      <p className="text-gray-500 text-xs text-center mt-3">
        * 점수가 낮을수록 해당 영역의 위험이 높음을 의미합니다
      </p>
    </div>
  );
}
