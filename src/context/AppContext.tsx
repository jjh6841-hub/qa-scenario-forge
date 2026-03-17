import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type {
  AppState,
  AppAction,
  AnalysisResults,
} from '../types';
import {
  mockRisks,
  mockScenarios,
  mockCases,
  mockPlaywrightFiles,
} from '../test/mocks/apiFixtures';

const initialStageState = {
  status: 'idle' as const,
  data: null,
  error: null,
};

const initialResults: AnalysisResults = {
  risks: { ...initialStageState },
  scenarios: { ...initialStageState },
  cases: { ...initialStageState },
  code: { ...initialStageState },
};

const initialState: AppState = {
  specText: '',
  isAnalyzing: false,
  results: initialResults,
  activeTab: 'risks',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SPEC_TEXT':
      return { ...state, specText: action.payload };

    case 'START_ANALYSIS':
      return {
        ...state,
        isAnalyzing: true,
        results: initialResults,
        activeTab: 'risks',
      };

    case 'STAGE_START':
      return {
        ...state,
        results: {
          ...state.results,
          [action.payload]: {
            status: 'processing',
            data: null,
            error: null,
            streamingText: '',
          },
        },
      };

    case 'STAGE_COMPLETE_RISKS':
      return {
        ...state,
        results: {
          ...state.results,
          risks: {
            status: 'complete',
            data: action.payload,
            error: null,
          },
        },
      };

    case 'STAGE_COMPLETE_SCENARIOS':
      return {
        ...state,
        results: {
          ...state.results,
          scenarios: {
            status: 'complete',
            data: action.payload,
            error: null,
          },
        },
      };

    case 'STAGE_COMPLETE_CASES':
      return {
        ...state,
        results: {
          ...state.results,
          cases: {
            status: 'complete',
            data: action.payload,
            error: null,
          },
        },
      };

    case 'STAGE_COMPLETE_CODE':
      return {
        ...state,
        isAnalyzing: false,
        results: {
          ...state.results,
          code: {
            status: 'complete',
            data: action.payload,
            error: null,
          },
        },
      };

    case 'STAGE_STREAM_CHUNK':
      return {
        ...state,
        results: {
          ...state.results,
          [action.payload.stage]: {
            ...state.results[action.payload.stage],
            streamingText: (state.results[action.payload.stage].streamingText ?? '') + action.payload.chunk,
          },
        },
      };

    case 'STAGE_ERROR':
      return {
        ...state,
        isAnalyzing: false,
        results: {
          ...state.results,
          [action.payload.stage]: {
            status: 'error',
            data: null,
            error: action.payload.error,
          },
        },
      };

    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };

    case 'RESET':
      return initialState;

    case 'LOAD_DEMO':
      return {
        ...state,
        isAnalyzing: false,
        activeTab: 'risks',
        results: {
          risks: { status: 'complete', data: mockRisks, error: null },
          scenarios: { status: 'complete', data: mockScenarios, error: null },
          cases: { status: 'complete', data: mockCases, error: null },
          code: { status: 'complete', data: mockPlaywrightFiles, error: null },
        },
      };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
