import { BreadcrumbManager as BreadcrumbManagerType } from '@coveo/headless';

import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';

import { breadcrumbManager, searchEngine } from '../headless';
import { Button } from '@mantine/core';
import { SearchResultsContext } from '@/utils/context/SearchResultsContext';

import styles from './Facet.module.css';

export function FacetBreadcrumbs() {
  const { locale  } = useRouter();
  const headlessBreadcrumbManager: BreadcrumbManagerType = useMemo(
    () => breadcrumbManager(),
    /* eslint-disable react-hooks/exhaustive-deps */
    [searchEngine],
  );

  const [breadcrumbState, setBreadcrumbState] = useState(headlessBreadcrumbManager.state);
  const [activeFilters, setActiveFilters] = useState<number>(0);
  const {  setClearAll } = useContext(SearchResultsContext);

  const deselectAll = () => headlessBreadcrumbManager.deselectAll();

  const getActiveFiltersCount = () => {
    const count = (breadcrumbState?.facetBreadcrumbs || [])
      .reduce((acc, breadcrumb) => acc + breadcrumb.values.length, 0);
    setActiveFilters(count);
  };
  const buttonDeselectAll = (
    <Button
      className={clsx(styles.clearAll)}
      variant="unstyled"
      onClick={deselectAll}
    >
      {'CLEAR_ALL'}
    </Button>
  );

  const breadcrumbs = breadcrumbState?.hasBreadcrumbs && activeFilters > 0 ? (
    <div className={clsx(styles.activeFilters)}>
      <div className={clsx(styles.activeFiltersTitle)}>
        {'ACTIVE_FILTERS'}
      </div>
      {buttonDeselectAll}
    </div>
  ) : null;

  const facetBreadcrumbs = breadcrumbState?.facetBreadcrumbs.map(
    (breadcrumb) => (
      <div
        className={clsx(styles.facetBreadcrumbsList)}
        key={breadcrumb.facetId}
      >
        {breadcrumb.values.map((item) => (
          <Button
            key={item.value.value}
            onClick={() => item.deselect()}
            className={clsx(styles.activedItem)}
          >
            {item.value.value}
          </Button>
        ))}
      </div>
    ),
  );

  useEffect(() => {
    getActiveFiltersCount();
  }, [breadcrumbState?.facetBreadcrumbs]);

  useEffect(
    () => {
      headlessBreadcrumbManager.subscribe(() => setBreadcrumbState(headlessBreadcrumbManager.state));
      return headlessBreadcrumbManager.subscribe(() => {});
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [],
  );

  useEffect(() => {
    if (setClearAll && breadcrumbState?.hasBreadcrumbs && activeFilters > 0) {
      setClearAll(buttonDeselectAll);
    } else {
      setClearAll(undefined);
    }
  }, [setClearAll, breadcrumbState?.hasBreadcrumbs, activeFilters]);

  return breadcrumbState?.facetBreadcrumbs
    && breadcrumbState?.facetBreadcrumbs?.length > 0 ? (
      <section className={clsx(styles.facetBreadcrumbs)}>
        {breadcrumbs}
        {facetBreadcrumbs}
      </section>
    ) : null;
}
