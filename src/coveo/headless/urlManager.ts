import { buildUrlManager, UrlManager } from '@coveo/headless';
import { NextRouter } from 'next/router';
import { searchStatus } from './searchStatus';
import { searchEngine } from './searchEngine';

export const urlManager = (fragment: string) => buildUrlManager(searchEngine, {
  initialState: { fragment },
});

type BindUrlManagerProps = {
  router: NextRouter,
};

const searchList = ['/search', '/busqueda'];
export const searchPathRegex = new RegExp(searchList.join('|'));

export const parseQueryString = (queryString: string): Record<string, string> => {
  const params: Record<string, string> = {};
  if (!queryString) return params;
  let tempQueryString = queryString.replace(/aq=[^&]*&?/, '');
  /* Only search page need to check q=xxx and tab=xxx, others should pass empty */
  if (!searchPathRegex.test(window.location.href)) {
    tempQueryString = tempQueryString.replace(/q=[^&]*&?/, '').replace(/tab=[^&]*&?/, '');
  }
  if (tempQueryString.indexOf('&') > -1) {
    const pairs = tempQueryString.split('&');
    pairs.forEach((pair) => {
      const [key, value] = pair.split('=');
      if (!key && !value) return;
      params[key] = value;
    });
  } else if (tempQueryString.indexOf('=') > 0) {
    const [key, value] = tempQueryString.split('=');
    params[key] = value;
  }
  return params;
};

export const fragment = (): string => {
  const urlPathSearch = window.location.search;
  let query = urlPathSearch.split('?')?.[1] || '';
  /* Only search page need to check q=xxx and tab=xxx, others should pass empty */
  if (!searchPathRegex.test(window.location.href)) {
    query = query.replace(/q=[^&]*&?/, '').replace(/tab=[^&]*&?/, '');
  }
  return query;
};

/**
 * Search parameters, defined in the url's query, should not be restored until all components are registered.
 *
 * Additionally, a search should not be executed until search parameters are restored.
 *
 * @param engine - A headless search engine instance.
 * @returns An unsubscribe function to remove attached event listeners.
 */
export function bindUrlManager({ router}: BindUrlManagerProps) {
  let urlManagerController: UrlManager | null = urlManager(fragment());
  console.log('urlManagerController', urlManagerController)
  const onQueryChange = () => {
    console.log('onQueryChange')
    urlManagerController?.synchronize(fragment());
  };

  /** *
  * TODO: Affect non-search page, need to do the further investigation
  * After comment it, the browser go back will not work
  * * */
  // router.events.on('routeChangeComplete', onQueryChange);
  window.addEventListener('popstate', onQueryChange);
  const unsubscribeManager = urlManagerController.subscribe(() => {
    const newUrl = `${router.asPath.split('?')[0]}?${urlManagerController?.state.fragment}`;
      console.log('newUrl', newUrl)
    // Cannot use router.push ({query}), it will double encode the query string and the encode is different than COVEO.
    if (!searchStatus.state.firstSearchExecuted) {
      router.replace(newUrl, undefined, { shallow: true }).catch(() => {});
      return;
    }
    router.push(newUrl, undefined, { shallow: true }).catch(() => {});
  });

  return () => {
    // router.events.off('routeChangeComplete', onQueryChange);
    window.removeEventListener('popstate', onQueryChange);
    unsubscribeManager();
    // urlManagerController?.synchronize('');
    console.log('unsubscribeManager', urlManagerController)
  };
}
