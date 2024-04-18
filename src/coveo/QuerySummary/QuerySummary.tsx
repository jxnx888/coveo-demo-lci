import { useEffect, useState } from 'react';
import { buildQuerySummary } from '@coveo/headless';
import { searchEngine } from '../headless';

export type QuerySummaryProps = {
  query?: string,
};
export function QuerySummary({ query }: QuerySummaryProps) {
  const headlessQuerySummary = buildQuerySummary(searchEngine);
  const [querySummaryState, setQuerySummaryState] = useState(
    headlessQuerySummary.state,
  );

  useEffect(() => {
    headlessQuerySummary.subscribe(() => setQuerySummaryState(headlessQuerySummary.state));
    return headlessQuerySummary.subscribe(() => {});
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  return querySummaryState?.hasResults ? (
    <div>
      {'Showing '}
      {querySummaryState.firstResult}
      {' - '}
      {querySummaryState.lastResult}
      {' of '}
      {querySummaryState.total.toString()}
      {query}
    </div>
  ) : (
    <div />
  );
}
