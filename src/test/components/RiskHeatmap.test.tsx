import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RiskHeatmap } from '../../components/results/risk/RiskHeatmap';
import type { RiskItem } from '../../types';

const mockRisks: RiskItem[] = [
  {
    id: 'RISK-001',
    category: '환자 안전',
    title: 'DUR 오류',
    description: '투약 오류 발생 가능',
    impact: 5,
    likelihood: 4,
    priority: 'critical',
  },
  {
    id: 'RISK-002',
    category: '규정 준수',
    title: '청구 오류',
    description: '심평원 청구 오류',
    impact: 3,
    likelihood: 2,
    priority: 'medium',
  },
];

describe('RiskHeatmap', () => {
  it('should render the heatmap title', () => {
    render(<RiskHeatmap risks={mockRisks} />);
    expect(screen.getByText('리스크 히트맵')).toBeInTheDocument();
  });

  it('should display axis labels', () => {
    render(<RiskHeatmap risks={mockRisks} />);
    expect(screen.getByText('영향도 (Impact)')).toBeInTheDocument();
    expect(screen.getByText('발생가능성 (Likelihood)')).toBeInTheDocument();
  });

  it('should render legend items', () => {
    render(<RiskHeatmap risks={mockRisks} />);
    expect(screen.getByText('위험 (20-25)')).toBeInTheDocument();
    expect(screen.getByText('높음 (10-19)')).toBeInTheDocument();
    expect(screen.getByText('보통 (6-9)')).toBeInTheDocument();
    expect(screen.getByText('낮음 (1-5)')).toBeInTheDocument();
  });

  it('should render a cell with count for cells that have risks', () => {
    render(<RiskHeatmap risks={mockRisks} />);
    // Cell at impact=5, likelihood=4 should show "1"
    const cells = screen.getAllByTitle(/DUR 오류/i);
    expect(cells.length).toBeGreaterThan(0);
  });

  it('should render with empty risks array without errors', () => {
    expect(() => render(<RiskHeatmap risks={[]} />)).not.toThrow();
  });
});
