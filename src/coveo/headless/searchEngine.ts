import {
  getOrganizationEndpoints,
  buildSearchEngine,
  SearchEngineConfiguration,
  buildContext,
} from '@coveo/headless';

const organizationId = process.env.COVEO_ORGANIZATION_ID!;
const accessToken = process.env.COVEO_ACCESS_TOKEN!;

const getSearchHub = () => {
  const searchHub = process.env.COVEO_SEARCH_HUB!;

  if (!searchHub) {
    throw new Error('COVEO_SEARCH_HUB has not be defined in your environment.');
  }

  return searchHub;
};
const getCoveoContext = () => {
  const coveoContext = process.env.COVEO_CONTEXT!;

  if (!coveoContext) {
    throw new Error('COVEO_CONTEXT has not be defined in your environment.');
  }

  return coveoContext;
};

export const commonConfig = {
  organizationId,
  accessToken,
  organizationEndpoints: getOrganizationEndpoints(organizationId),
  search: {
    searchHub: getSearchHub(),
  },
};

const configuration: SearchEngineConfiguration = commonConfig;

const buildEngine = () => {
  const locale = 'en'
  const config = configuration;
  if (locale) {
    config.search = {
      ...config.search,
      locale,
    };
  }
  return buildSearchEngine({ configuration: config });
};

export const searchEngine = buildEngine();

buildContext(searchEngine).add(getSearchHub(), getCoveoContext());
