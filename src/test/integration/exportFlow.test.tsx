import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { AppProvider } from '../../context/AppContext';
import { useAppContext } from '../../context/AppContext';
import { ExportBar } from '../../components/results/ExportBar';
import { mockRisks, mockScenarios, mockCases, mockPlaywrightFiles } from '../mocks/apiFixtures';

function TestWrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(AppProvider, null, children);
}

function ExportBarWithData() {
  const { dispatch } = useAppContext();

  React.useEffect(() => {
    dispatch({ type: 'STAGE_COMPLETE_RISKS', payload: mockRisks });
    dispatch({ type: 'STAGE_COMPLETE_SCENARIOS', payload: mockScenarios });
    dispatch({ type: 'STAGE_COMPLETE_CASES', payload: mockCases });
    dispatch({ type: 'STAGE_COMPLETE_CODE', payload: mockPlaywrightFiles });
  }, [dispatch]);

  return React.createElement(ExportBar, null);
}

describe('Export flow', () => {
  it('should not show export bar when no results are available', () => {
    render(
      React.createElement(TestWrapper, null, React.createElement(ExportBar, null))
    );
    expect(screen.queryByText('JSON 다운로드')).not.toBeInTheDocument();
  });

  it('should show export buttons when results are complete', async () => {
    render(
      React.createElement(TestWrapper, null, React.createElement(ExportBarWithData, null))
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByText('JSON 다운로드')).toBeInTheDocument();
    expect(screen.getByText('Markdown 다운로드')).toBeInTheDocument();
  });

  it('should trigger JSON export when JSON button is clicked', async () => {
    const clickSpy = vi.fn();
    const mockAnchor = document.createElement('a');
    mockAnchor.click = clickSpy;

    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string, options?: ElementCreationOptions) => {
      if (tag === 'a') return mockAnchor;
      return originalCreateElement(tag as keyof HTMLElementTagNameMap, options);
    });

    render(
      React.createElement(TestWrapper, null, React.createElement(ExportBarWithData, null))
    );

    await act(async () => {
      await Promise.resolve();
    });

    fireEvent.click(screen.getByText('JSON 다운로드'));
    expect(clickSpy).toHaveBeenCalledOnce();
    expect(mockAnchor.download).toMatch(/\.json$/);

    vi.restoreAllMocks();
  });
});
