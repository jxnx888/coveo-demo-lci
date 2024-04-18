import { buildBreadcrumbManager } from '@coveo/headless';
import { searchEngine } from './searchEngine';

export const breadcrumbManager = () => buildBreadcrumbManager(searchEngine);
