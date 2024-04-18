import {
  loadAdvancedSearchQueryActions,
  loadSearchAnalyticsActions,
  loadSearchActions,
  loadPipelineActions,
  AdvancedSearchQueryActionCreators,
  PipelineActionCreators,
} from '@coveo/headless';
import { searchEngine } from './searchEngine';

// eslint-disable-next-line max-len
export const advancedSearchQueryActions = (): AdvancedSearchQueryActionCreators => loadAdvancedSearchQueryActions(searchEngine);
export const pipelineActions = (): PipelineActionCreators => loadPipelineActions(searchEngine);
export const setDefaultPipeline = (pipeline: string) => pipelineActions().setPipeline(pipeline);
export const searchAnalyticsActions = () => loadSearchAnalyticsActions(searchEngine);
export const searchActions = () => loadSearchActions(searchEngine);
