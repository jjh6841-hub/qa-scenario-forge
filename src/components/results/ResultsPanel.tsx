import { useAppContext } from '../../context/AppContext';
import { PipelineProgress } from '../pipeline/PipelineProgress';
import { DomainScoreBar } from './DomainScoreBar';
import { TabContainer } from './TabContainer';
import { ExportBar } from './ExportBar';
import { EmptyState } from './EmptyState';

export function ResultsPanel() {
  const { state } = useAppContext();
  const { results, isAnalyzing } = state;

  const showDomainScores =
    results.risks.status === 'complete' && results.risks.data !== null;

  const allIdle =
    results.risks.status === 'idle' &&
    results.scenarios.status === 'idle' &&
    results.cases.status === 'idle' &&
    results.code.status === 'idle';

  const showEmptyState = allIdle && !isAnalyzing;

  return (
    <div className="flex flex-col gap-0">
      <PipelineProgress />

      {showEmptyState ? (
        <EmptyState />
      ) : (
        <>
          {showDomainScores && results.risks.data && (
            <DomainScoreBar risks={results.risks.data} />
          )}

          <TabContainer />

          <ExportBar />
        </>
      )}
    </div>
  );
}
