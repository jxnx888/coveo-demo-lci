import { Box } from '@mantine/core';
import clsx from 'clsx';
import { useContext, useEffect } from 'react';
import { v5 as uuidv5 } from 'uuid';

import { Facet } from './Facet';
import { FacetBreadcrumbs } from './FacetBreadcrumbs';
import { SearchResultsContext } from '@/utils/context/SearchResultsContext';
import { isNewsAndEvents, SearchResultsListProps } from '../SearchResultsList';

import styles from './Facet.module.css';

export type FacetsProps = {
  showFacetBreadcrumbs?: boolean,
  insideDrawer?: boolean,
  variant?: SearchResultsListProps['variant'],
  /* When type is latestNews, need topic for default disabled facet value */
  topic?: string | { value: string },
};

type FacetListProps = {
  id: string,
  title: string,
};

export function Facets({
  showFacetBreadcrumbs = true,
  insideDrawer = false,
  variant = 'default',
  topic,
}: FacetsProps) {
  const facetList: Array<FacetListProps> = [
    {
      id: 'facultiesAndSchools',
      title: 'Faculties and schools',
    },
    {
      id: 'fieldsOfStudy',
      title: 'Fields of study',
    },
    {
      id: 'diplomas',
      title: 'Diplomas',
    },
    {
      id: 'particularities',
      title: 'Particularities',
    },
    {
      id: 'deliveryMode',
      title: 'Delivery mode',
    },
    {
      id: 'teachingLanguage',
      title: 'Teaching language',
    },
    /* {
      id: 'duration',
      title: 'Duration',
    }, */
    {
      id: 'time',
      title: 'Time',
    },
    {
      id: 'schedule',
      title: 'Schedule',
    },
    /* {
      id: 'semester',
      title: 'Semester',
    }, */
    {
      id: 'campus',
      title: 'Campus',
    },
  ];

  if (isNewsAndEvents(variant)) {
    facetList.unshift(
      {
        id: 'dateYear',
        title: 'Years',
      },
      {
        id: 'categories',
        title: 'Categories',
      },
      {
        id: 'tags',
        title: 'Tags',
      },
    );
  } else {
    facetList.push(
      {
        id: 'dateYear',
        title: 'Years',
      },
      {
        id: 'categories',
        title: 'Categories',
      },
      {
        id: 'tags',
        title: 'Tags',
      },
    );
  }

  return (
    <Box
      pos="relative"
      className={clsx(
        styles.facetsContainer,
        { [styles.facetsContainer__insideDrawer]: insideDrawer },
        { [styles.facetsContainer__program]: variant === 'program' },
        { [styles.facetsContainer__programDrawer]: variant === 'program' && insideDrawer },
      )}
    >
      {showFacetBreadcrumbs && <FacetBreadcrumbs />}
      <div className={clsx(styles.facetsItems)}>
        {
          facetList.map((facet, index) => {
            /* Hide Campus facets when it is not global website */
            return (
              <Facet
                key={uuidv5(`${facet.id}-${index}`, uuidv5.URL)}
                id={facet.id}
                title={facet.id}
                isExpanded
                topic={topic}
              />
            );
          })
        }
      </div>
    </Box>
  );
}
