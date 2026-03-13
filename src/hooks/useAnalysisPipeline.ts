import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  analyzeRisk,
  generateScenarios,
  generateCases,
  generatePlaywrightCode,
} from '../api/claude';
import type { RiskItem, TestScenario } from '../types';

export function useAnalysisPipeline() {
  const { state, dispatch } = useAppContext();

  const runAnalysis = useCallback(async () => {
    if (!state.specText.trim() || state.isAnalyzing) return;

    dispatch({ type: 'START_ANALYSIS' });

    // Stage 1: Risk Analysis
    dispatch({ type: 'STAGE_START', payload: 'risks' });
    let risks: RiskItem[] = [];
    try {
      risks = await analyzeRisk(state.specText);
      dispatch({ type: 'STAGE_COMPLETE_RISKS', payload: risks });
      dispatch({ type: 'SET_ACTIVE_TAB', payload: 'risks' });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '리스크 분석 중 오류가 발생했습니다.';
      dispatch({
        type: 'STAGE_ERROR',
        payload: { stage: 'risks', error: errorMsg },
      });
      return;
    }

    // Stage 2: Scenario Generation
    dispatch({ type: 'STAGE_START', payload: 'scenarios' });
    let scenarios: TestScenario[] = [];
    try {
      scenarios = await generateScenarios(state.specText, risks);
      dispatch({ type: 'STAGE_COMPLETE_SCENARIOS', payload: scenarios });
      dispatch({ type: 'SET_ACTIVE_TAB', payload: 'scenarios' });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : '시나리오 생성 중 오류가 발생했습니다.';
      dispatch({
        type: 'STAGE_ERROR',
        payload: { stage: 'scenarios', error: errorMsg },
      });
      return;
    }

    // Stage 3: Test Case Generation
    dispatch({ type: 'STAGE_START', payload: 'cases' });
    try {
      const cases = await generateCases(scenarios, risks);
      dispatch({ type: 'STAGE_COMPLETE_CASES', payload: cases });
      dispatch({ type: 'SET_ACTIVE_TAB', payload: 'cases' });

      // Stage 4: Playwright Code Generation
      dispatch({ type: 'STAGE_START', payload: 'code' });
      try {
        const files = await generatePlaywrightCode(cases, scenarios);
        dispatch({ type: 'STAGE_COMPLETE_CODE', payload: files });
        dispatch({ type: 'SET_ACTIVE_TAB', payload: 'code' });
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : '코드 생성 중 오류가 발생했습니다.';
        dispatch({
          type: 'STAGE_ERROR',
          payload: { stage: 'code', error: errorMsg },
        });
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : '테스트 케이스 생성 중 오류가 발생했습니다.';
      dispatch({
        type: 'STAGE_ERROR',
        payload: { stage: 'cases', error: errorMsg },
      });
    }
  }, [state.specText, state.isAnalyzing, dispatch]);

  return {
    runAnalysis,
    isAnalyzing: state.isAnalyzing,
  };
}
