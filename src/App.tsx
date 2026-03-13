import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { InputPanel } from './components/input/InputPanel';
import { ResultsPanel } from './components/results/ResultsPanel';

function App() {
  return (
    <AppProvider>
      <AppLayout
        inputPanel={<InputPanel />}
        resultsPanel={<ResultsPanel />}
      />
    </AppProvider>
  );
}

export default App;
