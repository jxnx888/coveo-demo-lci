import {
  buildFacet,
  Facet as FacetType,
  FacetOptions,
  buildFacetManager,
} from '@coveo/headless';
import { searchEngine } from './searchEngine';

export const facet = ({
  field,
  facetId,
  numberOfValues,
  sortCriteria,
}: FacetOptions): FacetType => (
  buildFacet(searchEngine, {
    options: {
      field,
      facetId,
      numberOfValues,
      sortCriteria,
    },
  }));
export const facetManager = () => buildFacetManager(searchEngine);
