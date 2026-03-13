import type { RiskItem } from '../types';

export function calculateRiskScore(impact: number, likelihood: number): number {
  return impact * likelihood;
}

export function getRiskColor(impact: number, likelihood: number): string {
  const score = calculateRiskScore(impact, likelihood);

  if (score >= 20) return 'bg-red-600 text-white';
  if (score >= 15) return 'bg-red-500 text-white';
  if (score >= 10) return 'bg-orange-500 text-white';
  if (score >= 6) return 'bg-yellow-400 text-gray-900';
  if (score >= 3) return 'bg-yellow-200 text-gray-800';
  return 'bg-green-200 text-gray-800';
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 text-red-800 border border-red-300';
    case 'high':
      return 'bg-orange-100 text-orange-800 border border-orange-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    case 'low':
      return 'bg-green-100 text-green-800 border border-green-300';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
}

export interface DomainScores {
  patientSafety: number;
  compliance: number;
  dataIntegrity: number;
}

export function getDomainScores(risks: RiskItem[]): DomainScores {
  const patientSafetyKeywords = ['환자 안전', '투약', 'DUR', '처방', '약물', '안전'];
  const complianceKeywords = ['규정', '법', '심평원', '개인정보', '의료법', '준수', '청구'];
  const dataIntegrityKeywords = ['데이터', '무결성', '손실', '변조', '보존', '기록', '저장'];

  function matchesCategory(risk: RiskItem, keywords: string[]): boolean {
    const text = `${risk.category} ${risk.title} ${risk.description}`;
    return keywords.some((kw) => text.includes(kw));
  }

  function calculateCategoryScore(keywords: string[]): number {
    const matching = risks.filter((r) => matchesCategory(r, keywords));
    if (matching.length === 0) return 0;
    const avgScore =
      matching.reduce((sum, r) => sum + calculateRiskScore(r.impact, r.likelihood), 0) /
      matching.length;
    return Math.min(100, Math.round((1 - avgScore / 25) * 100));
  }

  return {
    patientSafety: calculateCategoryScore(patientSafetyKeywords),
    compliance: calculateCategoryScore(complianceKeywords),
    dataIntegrity: calculateCategoryScore(dataIntegrityKeywords),
  };
}
