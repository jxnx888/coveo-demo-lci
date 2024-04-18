import { buildTab, Tab, TabOptions } from '@coveo/headless';
import { searchEngine } from './searchEngine';

export const searchTab = ({ expression, id }: TabOptions): Tab => buildTab(searchEngine, {
  options: {
    expression,
    id,
  },
});
