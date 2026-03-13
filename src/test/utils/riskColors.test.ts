import { describe, it, expect } from 'vitest';
import {
  getRiskColor,
  getPriorityColor,
  calculateRiskScore,
  getDomainScores,
} from '../../utils/riskColors';
import type { RiskItem } from '../../types';

describe('calculateRiskScore', () => {
  it('should multiply impact and likelihood correctly', () => {
    expect(calculateRiskScore(5, 5)).toBe(25);
  });

  it('should return 1 for minimum values', () => {
    expect(calculateRiskScore(1, 1)).toBe(1);
  });

  it('should calculate mid-range score correctly', () => {
    expect(calculateRiskScore(3, 4)).toBe(12);
  });
});

describe('getRiskColor', () => {
  it('should return red color for critical score (20-25)', () => {
    const color = getRiskColor(5, 4);
    expect(color).toContain('red');
  });

  it('should return orange color for high score (10-19)', () => {
    const color = getRiskColor(4, 3);
    expect(color).toContain('orange');
  });

  it('should return yellow color for medium score (6-9)', () => {
    const color = getRiskColor(3, 2);
    expect(color).toContain('yellow');
  });

  it('should return green color for low score (1-5)', () => {
    const color = getRiskColor(1, 2);
    expect(color).toContain('green');
  });

  it('should return red-600 for maximum risk score', () => {
    const color = getRiskColor(5, 5);
    expect(color).toBe('bg-red-600 text-white');
  });
});

describe('getPriorityColor', () => {
  it('should return red color for critical priority', () => {
    const color = getPriorityColor('critical');
    expect(color).toContain('red');
  });

  it('should return orange color for high priority', () => {
    const color = getPriorityColor('high');
    expect(color).toContain('orange');
  });

  it('should return yellow color for medium priority', () => {
    const color = getPriorityColor('medium');
    expect(color).toContain('yellow');
  });

  it('should return green color for low priority', () => {
    const color = getPriorityColor('low');
    expect(color).toContain('green');
  });

  it('should return gray color for unknown priority', () => {
    const color = getPriorityColor('unknown');
    expect(color).toContain('gray');
  });
});

describe('getDomainScores', () => {
  const mockRisks: RiskItem[] = [
    {
      id: 'RISK-001',
      category: '환자 안전',
      title: '투약 오류',
      description: 'DUR 점검 실패로 인한 투약 오류',
      impact: 5,
      likelihood: 4,
      priority: 'critical',
    },
    {
      id: 'RISK-002',
      category: '규정 준수',
      title: '심평원 청구 오류',
      description: '법령 위반 청구 코드',
      impact: 4,
      likelihood: 3,
      priority: 'high',
    },
    {
      id: 'RISK-003',
      category: '데이터 무결성',
      title: '데이터 손실',
      description: '처방 데이터 저장 실패',
      impact: 5,
      likelihood: 2,
      priority: 'high',
    },
  ];

  it('should return scores between 0 and 100', () => {
    const scores = getDomainScores(mockRisks);
    expect(scores.patientSafety).toBeGreaterThanOrEqual(0);
    expect(scores.patientSafety).toBeLessThanOrEqual(100);
    expect(scores.compliance).toBeGreaterThanOrEqual(0);
    expect(scores.compliance).toBeLessThanOrEqual(100);
    expect(scores.dataIntegrity).toBeGreaterThanOrEqual(0);
    expect(scores.dataIntegrity).toBeLessThanOrEqual(100);
  });

  it('should return 0 for all categories when no risks provided', () => {
    const scores = getDomainScores([]);
    expect(scores.patientSafety).toBe(0);
    expect(scores.compliance).toBe(0);
    expect(scores.dataIntegrity).toBe(0);
  });

  it('should return lower score for higher risk (inverse relationship)', () => {
    const highRisks: RiskItem[] = [
      {
        id: 'R1',
        category: '환자 안전',
        title: '위험',
        description: '투약 실수',
        impact: 5,
        likelihood: 5,
        priority: 'critical',
      },
    ];
    const lowRisks: RiskItem[] = [
      {
        id: 'R2',
        category: '환자 안전',
        title: '낮은 위험',
        description: '경미한 문제',
        impact: 1,
        likelihood: 1,
        priority: 'low',
      },
    ];
    const highScores = getDomainScores(highRisks);
    const lowScores = getDomainScores(lowRisks);
    expect(highScores.patientSafety).toBeLessThan(lowScores.patientSafety);
  });
});
