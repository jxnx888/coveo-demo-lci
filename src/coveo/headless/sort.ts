/* eslint-disable max-len */

import {
  buildDateSortCriterion,
  buildFieldSortCriterion,
  buildRelevanceSortCriterion,
  buildSort,
  SortByDate,
  SortByRelevancy,
  SortCriterion,
  SortOrder,
  SortByField,
} from '@coveo/headless';
import { searchEngine } from './searchEngine';

export const sort = (criterion?: SortCriterion | Array<SortCriterion>) => buildSort(searchEngine, {
  initialState: { criterion },
});

export const relevanceSortCriterion = (): SortByRelevancy => buildRelevanceSortCriterion();

export const sortFieldName = 'lci_page_title';
export const sortFieldPublishDate = 'lci_publish_date';

export const titleAscendingSortCriterion = (): SortByField => buildFieldSortCriterion(sortFieldName, SortOrder.Ascending);

export const titleDescendingSortCriterion = (): SortByField => buildFieldSortCriterion(sortFieldName, SortOrder.Descending);

export const publishAscendingSortCriterion = (): SortByField => buildFieldSortCriterion(sortFieldPublishDate, SortOrder.Ascending);

export const publishDescendingSortCriterion = (): SortByField => buildFieldSortCriterion(sortFieldPublishDate, SortOrder.Descending);

export const dateDescendingSortCriterion = (): SortByDate => buildDateSortCriterion(SortOrder.Descending);

export const dateAscendingSortCriterion = (): SortByDate => buildDateSortCriterion(SortOrder.Ascending);
