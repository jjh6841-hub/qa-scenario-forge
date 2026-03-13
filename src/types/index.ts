export interface RiskItem {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: number; // 1-5
  likelihood: number; // 1-5
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface TestScenario {
  id: string;
  title: string;
  riskIds: string[];
  type: 'functional' | 'security' | 'compliance' | 'performance' | 'usability';
  preconditions: string[];
  description: string;
}

export interface TestStep {
  order: number;
  action: string;
  expectedResult: string;
}

export interface TestCase {
  id: string;
  scenarioId: string;
  title: string;
  steps: TestStep[];
  expectedResult: string;
  priority: 'P1' | 'P2' | 'P3';
  automatable: boolean;
}

export interface PlaywrightFile {
  filename: string;
  description: string;
  code: string;
}

export type StageStatus = 'idle' | 'processing' | 'complete' | 'error';

export interface StageState<T> {
  status: StageStatus;
  data: T | null;
  error: string | null;
}

export interface AnalysisResults {
  risks: StageState<RiskItem[]>;
  scenarios: StageState<TestScenario[]>;
  cases: StageState<TestCase[]>;
  code: StageState<PlaywrightFile[]>;
}

export type ActiveTab = 'risks' | 'scenarios' | 'cases' | 'code';

export interface AppState {
  specText: string;
  isAnalyzing: boolean;
  results: AnalysisResults;
  activeTab: ActiveTab;
}

export type AppAction =
  | { type: 'SET_SPEC_TEXT'; payload: string }
  | { type: 'START_ANALYSIS' }
  | { type: 'STAGE_START'; payload: keyof AnalysisResults }
  | { type: 'STAGE_COMPLETE_RISKS'; payload: RiskItem[] }
  | { type: 'STAGE_COMPLETE_SCENARIOS'; payload: TestScenario[] }
  | { type: 'STAGE_COMPLETE_CASES'; payload: TestCase[] }
  | { type: 'STAGE_COMPLETE_CODE'; payload: PlaywrightFile[] }
  | { type: 'STAGE_ERROR'; payload: { stage: keyof AnalysisResults; error: string } }
  | { type: 'SET_ACTIVE_TAB'; payload: ActiveTab }
  | { type: 'RESET' };

export interface Preset {
  id: string;
  label: string;
  description: string;
  spec: string;
}
