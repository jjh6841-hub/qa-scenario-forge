import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TestCaseTable } from '../../components/results/cases/TestCaseTable';
import { mockCases } from '../mocks/apiFixtures';

describe('TestCaseTable', () => {
  it('should render the table with test case count', () => {
    render(<TestCaseTable cases={mockCases} />);
    expect(
      screen.getByText(`테스트 케이스 (${mockCases.length}개)`)
    ).toBeInTheDocument();
  });

  it('should render all test case titles', () => {
    render(<TestCaseTable cases={mockCases} />);
    for (const tc of mockCases) {
      expect(screen.getByText(tc.title)).toBeInTheDocument();
    }
  });

  it('should expand a test case when clicked to show steps', () => {
    render(<TestCaseTable cases={mockCases} />);
    const firstCase = mockCases[0];
    const titleElement = screen.getByText(firstCase.title);
    fireEvent.click(titleElement.closest('tr')!);

    // Check that steps are now visible
    const firstStep = firstCase.steps[0];
    expect(screen.getByText(firstStep.action)).toBeInTheDocument();
  });

  it('should show automatable count in the header', () => {
    render(<TestCaseTable cases={mockCases} />);
    const automatableCount = mockCases.filter((c) => c.automatable).length;
    expect(screen.getByText(`자동화 가능: ${automatableCount}개`)).toBeInTheDocument();
  });

  it('should display priority badges for each test case', () => {
    render(<TestCaseTable cases={mockCases} />);
    for (const tc of mockCases) {
      expect(screen.getAllByText(tc.priority).length).toBeGreaterThan(0);
    }
  });
});
