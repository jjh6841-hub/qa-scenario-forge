import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import React from 'react';
import { mockRisks, mockScenarios, mockCases, mockPlaywrightFiles } from '../mocks/apiFixtures';

// Mock the claude API module - factory must not reference out-of-scope variables
vi.mock('../../api/claude', () => ({
  analyzeRisk: vi.fn(),
  generateScenarios: vi.fn(),
  generateCases: vi.fn(),
  generatePlaywrightCode: vi.fn(),
}));

import { AppProvider } from '../../context/AppContext';
import { useAnalysisPipeline } from '../../hooks/useAnalysisPipeline';
import { useAppContext } from '../../context/AppContext';
import { analyzeRisk, generateScenarios, generateCases, generatePlaywrightCode } from '../../api/claude';

function wrapper({ children }: { children: ReactNode }) {
  return React.createElement(AppProvider, null, children);
}

describe('useAnalysisPipeline integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(analyzeRisk).mockResolvedValue(mockRisks);
    vi.mocked(generateScenarios).mockResolvedValue(mockScenarios);
    vi.mocked(generateCases).mockResolvedValue(mockCases);
    vi.mocked(generatePlaywrightCode).mockResolvedValue(mockPlaywrightFiles);
  });

  it('should not run when specText is empty', async () => {
    const { result } = renderHook(
      () => ({ pipeline: useAnalysisPipeline(), context: useAppContext() }),
      { wrapper }
    );

    await act(async () => {
      await result.current.pipeline.runAnalysis();
    });

    expect(analyzeRisk).not.toHaveBeenCalled();
  });

  it('should dispatch START_ANALYSIS and run all 4 stages sequentially', async () => {
    const { result } = renderHook(
      () => ({ pipeline: useAnalysisPipeline(), context: useAppContext() }),
      { wrapper }
    );

    // Set spec text
    act(() => {
      result.current.context.dispatch({ type: 'SET_SPEC_TEXT', payload: '테스트 명세서' });
    });

    await act(async () => {
      await result.current.pipeline.runAnalysis();
    });

    expect(analyzeRisk).toHaveBeenCalledOnce();
    expect(generateScenarios).toHaveBeenCalledOnce();
    expect(generateCases).toHaveBeenCalledOnce();
    expect(generatePlaywrightCode).toHaveBeenCalledOnce();
  });

  it('should complete all stages and set results', async () => {
    const { result } = renderHook(
      () => ({ pipeline: useAnalysisPipeline(), context: useAppContext() }),
      { wrapper }
    );

    act(() => {
      result.current.context.dispatch({ type: 'SET_SPEC_TEXT', payload: '테스트 명세서' });
    });

    await act(async () => {
      await result.current.pipeline.runAnalysis();
    });

    const state = result.current.context.state;
    expect(state.results.risks.status).toBe('complete');
    expect(state.results.scenarios.status).toBe('complete');
    expect(state.results.cases.status).toBe('complete');
    expect(state.results.code.status).toBe('complete');
    expect(state.isAnalyzing).toBe(false);
  });

  it('should handle error in risk analysis stage', async () => {
    vi.mocked(analyzeRisk).mockRejectedValueOnce(new Error('API 오류'));

    const { result } = renderHook(
      () => ({ pipeline: useAnalysisPipeline(), context: useAppContext() }),
      { wrapper }
    );

    act(() => {
      result.current.context.dispatch({ type: 'SET_SPEC_TEXT', payload: '테스트 명세서' });
    });

    await act(async () => {
      await result.current.pipeline.runAnalysis();
    });

    const state = result.current.context.state;
    expect(state.results.risks.status).toBe('error');
    expect(state.results.risks.error).toBe('API 오류');
    expect(state.isAnalyzing).toBe(false);
    // Subsequent stages should not have been called
    expect(generateScenarios).not.toHaveBeenCalled();
  });

  it('should handle error in scenarios stage', async () => {
    vi.mocked(generateScenarios).mockRejectedValueOnce(new Error('시나리오 생성 실패'));

    const { result } = renderHook(
      () => ({ pipeline: useAnalysisPipeline(), context: useAppContext() }),
      { wrapper }
    );

    act(() => {
      result.current.context.dispatch({ type: 'SET_SPEC_TEXT', payload: '테스트 명세서' });
    });

    await act(async () => {
      await result.current.pipeline.runAnalysis();
    });

    const state = result.current.context.state;
    expect(state.results.risks.status).toBe('complete');
    expect(state.results.scenarios.status).toBe('error');
    expect(state.isAnalyzing).toBe(false);
  });

  it('should pass risks data to generateScenarios', async () => {
    const { result } = renderHook(
      () => ({ pipeline: useAnalysisPipeline(), context: useAppContext() }),
      { wrapper }
    );

    act(() => {
      result.current.context.dispatch({ type: 'SET_SPEC_TEXT', payload: '테스트 명세서' });
    });

    await act(async () => {
      await result.current.pipeline.runAnalysis();
    });

    expect(generateScenarios).toHaveBeenCalledWith('테스트 명세서', mockRisks);
  });
});
