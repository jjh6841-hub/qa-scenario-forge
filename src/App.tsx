import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { InputPanel } from './components/input/InputPanel';
import { ResultsPanel } from './components/results/ResultsPanel';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppLayout
          inputPanel={
            <ErrorBoundary>
              <InputPanel />
            </ErrorBoundary>
          }
          resultsPanel={
            <ErrorBoundary>
              <ResultsPanel />
            </ErrorBoundary>
          }
        />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
