import {
  buildSearchBox,
  loadAdvancedSearchQueryActions,
  loadSearchActions,
  loadSearchAnalyticsActions,
  SearchBoxOptions,
} from '@coveo/headless';
import _ from 'lodash';
import { NextRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';

import { searchTab } from './buildTab';
import { searchEngine } from './searchEngine';

const options: SearchBoxOptions = {
  numberOfSuggestions: 10,
  highlightOptions: {
    notMatchDelimiters: {
      open: '<span>',
      close: '</span>',
    },
    exactMatchDelimiters: {
      open: '<strong>',
      close: '</strong>',
    },
  },
};

export const COVEO_AQ = 'coveo_aq';
export const COVEO_CAMPUS = 'lci_campus';
export const COVEO_CATEGORY = 'lci_category';
export const COVEO_CATEGORY_ALL = 'All';
export const COVEO_CATEGORY_EVENTS = 'Events';
export const COVEO_CATEGORY_NEWS = 'News';
export const COVEO_CATEGORY_PROGRAM = 'Programs';
export const COVEO_LANGUAGE = 'lci_lang_code';
export const FACET_CATEGORY_FIELD_ID = 'category';
export const tabList = {
  all: 'tabAll',
  news: 'tabNews',
  events: 'tabEvents',
  programs: 'tabPrograms',
};

export const searchBox = buildSearchBox(searchEngine, { options });

const { logInterfaceLoad } = loadSearchAnalyticsActions(searchEngine);
const { executeSearch } = loadSearchActions(searchEngine);

export const initExecuteSearch = async () => {
  await searchEngine.dispatch(executeSearch(logInterfaceLoad()));
};

/*
* Filter the campus based on the different app,
* Filter the category based on the search page middle menu.
* Hidden query for end user
* */
export const coveoAdvancedSearch = (query: string, value: string) => {
  if (!_.isEmpty(query)) {
    const loadAdvancedSearchQuery = loadAdvancedSearchQueryActions(searchEngine);

    const locale = 'en';
    const aqLocale = `@${COVEO_LANGUAGE}==${locale}`;

    const campus = 'Global';
    /* Add the campus as default advanced search query */
    const aqCampus = !_.isEmpty(campus) && campus !== 'Global' ? `@${COVEO_CAMPUS}==${campus}` : '';

    const aqOther = !_.isEmpty(value) ? `@${query}==${value}` : '';

    let aqFinal = aqLocale;

    if (!_.isEmpty(aqCampus)) {
      if (!_.isEmpty(aqOther)) {
        aqFinal = `${aqLocale} AND ${aqCampus} AND ${aqOther}`;
      } else {
        aqFinal = `${aqLocale} AND ${aqCampus}`;
      }
    } else {
      // No campus mean global website
      const globalLocales = [];
      if (_.isEmpty(aqOther)) {
        globalLocales.push(`${aqLocale}`);
      } else {
        globalLocales.push(`(${aqLocale} AND ${aqOther})`);
      }
      aqFinal = globalLocales.join(' OR ');
    }

    /* Add other advanced search query as additional query */
    const action = loadAdvancedSearchQuery.registerAdvancedSearchQueries({
      aq: aqFinal,
    });
    searchEngine.dispatch(action);
  }
};

/**
 * Add coveo advanced search query to search engine
 * such as campus, language, etc.
 * */
export const initCoveoSearch = () => {
  coveoAdvancedSearch(COVEO_CAMPUS, '');
  searchTab({ expression: '', id: tabList.all }).select();
};

export const coveoOnChangeHandler = (value: string) => {
  searchBox.updateText(value);
};

export type FacetItem = {
  field: string,
  value: string,
};

export type OnSubmitHandlerProps = {
  router: NextRouter,
  setLoading?: Dispatch<SetStateAction<boolean>>,
  query?: string,
};

export const clearSearch = () => searchBox.clear();

export const resetSearch = () => {
  searchTab({ expression: '', id: tabList.all }).select();
  searchBox.updateText('');
  searchBox.submit();
};

export const coveoOnSubmitHandler = ({ router, setLoading, query }: OnSubmitHandlerProps) => {
  searchBox.submit();
  initCoveoSearch();
  const searchQuery = `q=${searchBox.state.value}${query || ''}`;

  router
    .push(`/search?${searchQuery}`)
    .then(() => {})
    .catch(() => {});
  if (setLoading) {
    setTimeout(() => setLoading(false), 1000);
  }
};
