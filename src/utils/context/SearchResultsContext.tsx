import { createContext, Dispatch, SetStateAction } from 'react';

export type SearchResultsContextType = {

  /* The clear all facets breadcrumb DOM with click function */
  clearAll: JSX.Element | undefined,
  setClearAll: Dispatch<SetStateAction<JSX.Element | undefined>>,
};
export const SearchResultsContext = createContext<SearchResultsContextType>({
  clearAll: undefined,
  setClearAll: () => {},
});
