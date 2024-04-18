import { buildPager } from '@coveo/headless';
import { searchEngine } from './searchEngine';

export const pager = (numberOfPages: number) => buildPager(searchEngine, {
  options: { numberOfPages },
});
