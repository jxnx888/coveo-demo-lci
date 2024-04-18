import { FacetValue } from '@coveo/headless';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Accordion as MantineAccordion } from '@mantine/core';

import { Button } from '@mantine/core';
import { facet, searchEngine } from '../headless';
import { Heading } from '@/components/Heading';
import { SearchResultsContext } from '@/utils/context/SearchResultsContext';
import { Checkbox } from '@mantine/core';

import styles from './Facet.module.css';

export type FacetsProps = {
  [PropsName: string]: {
    title: string,
    i18n: string,
    meta: string,
    field: string,
  },
};

export const Facets: FacetsProps = {
  facultiesAndSchools: {
    title: 'Faculties and schools',
    i18n: 'FACULTIES_AND_SCHOOLS',
    meta: 'facultiesAndSchools',
    field: 'lci_faculties_and_schools',
  },
  fieldsOfStudy: {
    title: 'Fields of study',
    i18n: 'FIELDS_OF_STUDY',
    meta: 'fieldsOfStudy',
    field: 'lci_fields_of_study',
  },
  diplomas: {
    title: 'Diplomas',
    i18n: 'DIPLOMAS',
    meta: 'diplomas',
    field: 'lci_diplomas',
  },
  particularities: {
    title: 'Particularities',
    i18n: 'PARTICULARITIES',
    meta: 'particularities',
    field: 'lci_particularities',
  },
  deliveryMode: {
    title: 'Delivery mode',
    i18n: 'DELIVERY_MODE',
    meta: 'deliveryMode',
    field: 'lci_delivery_mode',
  },
  teachingLanguage: {
    title: 'Teaching language',
    i18n: 'TEACHING_LANGUAGE',
    meta: 'teachingLanguage',
    field: 'lci_teaching_language',
  },
  duration: {
    title: 'Duration',
    i18n: 'DURATION',
    meta: 'duration',
    field: 'lci_duration',
  },
  time: {
    title: 'Time',
    i18n: 'TIME',
    meta: 'time',
    field: 'lci_time',
  },
  schedule: {
    title: 'Schedule',
    i18n: 'SCHEDULE',
    meta: 'schedule',
    field: 'lci_schedule',
  },
  semester: {
    title: 'Semester',
    i18n: 'SEMESTER',
    meta: 'semester',
    field: 'lci_semester',
  },
  campus: {
    title: 'Campus',
    i18n: 'CAMPUS',
    meta: 'campus',
    field: 'lci_campus',
  },
  category: {
    title: 'Category',
    i18n: 'CATEGORY',
    meta: 'category',
    field: 'lci_category',
  },
  categories: {
    title: 'Categories',
    i18n: 'CATEGORY',
    meta: 'categories',
    field: 'lci_news_events_categories',
  },
  tags: {
    title: 'Tags',
    i18n: 'TAGS',
    meta: 'tags',
    field: 'lci_tags',
  },
  dateYear: {
    title: 'Years',
    i18n: 'DATE',
    meta: 'dateYear',
    field: 'lci_news_events_date_year',
  },
};

export type FacetProps = {
  title: keyof typeof Facets,
  id: string,
  isExpanded?: boolean,
  /* When type is latestNews, need topic for default disabled facet value */
  topic?: string | { value: string },
};

export function Facet({ title, id, isExpanded = false, topic }: FacetProps) {
  const { locale } = useRouter();
  const headlessFacet = useMemo(
    () => facet({
      field: Facets[title].field,
      facetId: id,
      numberOfValues: 5,
      sortCriteria: 'alphanumeric',
    }),
    /* eslint-disable react-hooks/exhaustive-deps */
    [title, searchEngine],
  );

  const [facetState, setFacetState] = useState(headlessFacet.state);
  const [defaultFacetValue, setDefaultFacetValue] = useState<string>('');

  const toggleSelect = (value: FacetValue) => {
    headlessFacet.toggleSelect(value);
  };
  const showMoreHandler = () => {
    headlessFacet.showMoreValues();
  };
  const showLessHandler = () => {
    headlessFacet.showLessValues();
  };

  const facetSearch = (value: string) => {
    headlessFacet.facetSearch.updateText(value);
    headlessFacet.facetSearch.search();
  };

  useEffect(() => {
    if (facetState?.facetSearch?.values?.length) {
      headlessFacet.facetSearch.select(facetState?.facetSearch?.values[0]);
      setDefaultFacetValue(facetState?.facetSearch?.values[0].rawValue);
    }
  }, [facetState?.facetSearch?.values?.length]);

  /* If this is the topic page */
  useEffect(() => {
    if (topic) {
      if (typeof topic === 'object') {
        facetSearch(topic?.value);
      } else {
        facetSearch(topic);
      }
    }
  }, [topic]);

  useEffect(
    () => {
      headlessFacet.subscribe(() => setFacetState(headlessFacet.state));
      return headlessFacet.subscribe(() => {});
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [],
  );

  return facetState?.values && facetState?.values?.length > 0 ? (
    <MantineAccordion
      key={title}
      className={clsx(styles.facetsAccordion)}
      multiple
      transitionDuration={400}
      variant="separated"
      defaultValue={isExpanded ? [Facets[title].title] : []}
    >
      <MantineAccordion.Item
        className={clsx(styles.accordionItem)}
        value={Facets[title].title}
      >
        <MantineAccordion.Control
          className={clsx(styles.control)}
        >
          <Heading className={clsx(styles.facetTitle)} as={'h5'}>
            {Facets[title].i18n}
          </Heading>
        </MantineAccordion.Control>
        <MantineAccordion.Panel className={clsx(styles.panel)}>
          {facetState?.values
            && facetState?.values?.length > 0
            && facetState?.values.map((value: FacetValue) => (
              <Checkbox
                className={clsx(
                  styles.checkbox,
                  { [styles.disabledCheckbox]: defaultFacetValue === value.value },
                )}
                key={value.value}
                size="xs"
                label={`${value.value} (${value.numberOfResults})`}
                checked={headlessFacet.isValueSelected(value)}
                disabled={defaultFacetValue === value.value}
                onChange={() => {
                  toggleSelect(value);
                }}
              />
            ))}

          {facetState?.canShowMoreValues && (
            <div>
              <Button
                variant="unstyled"
                onClick={showMoreHandler}
                className={clsx(styles.showMoreButton)}
              >
                {'SHOW_MORE'}
              </Button>
            </div>
          )}
          {facetState?.canShowLessValues && (
            <div>
              <Button
                variant="unstyled"
                onClick={showLessHandler}
                className={clsx(styles.showLessButton)}
              >
                {'SHOW_LESS'}
              </Button>
            </div>
          )}
        </MantineAccordion.Panel>
      </MantineAccordion.Item>
    </MantineAccordion>
  ) : null;
}
