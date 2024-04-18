import { CoveoSearchBox } from "@/components/CoveoSearchBox";
import { Box, Grid, Drawer, LoadingOverlay } from '@mantine/core';
import { useMediaQuery, useDisclosure } from '@mantine/hooks';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { v5 as uuidv5 } from 'uuid';
import dynamic from 'next/dynamic';

import { BREAKPOINTS } from '@/utils/breakpoints';
import { Button } from '@mantine/core';
import { Facets } from '@/coveo/Facet/Facets';
import { Heading } from '@/components/Heading';
import {
  bindUrlManager,
  COVEO_CATEGORY,
  COVEO_CATEGORY_EVENTS,
  COVEO_CATEGORY_NEWS,
  COVEO_CATEGORY_PROGRAM,
  coveoAdvancedSearch,
  initExecuteSearch,
  resetSearch,
  resultList,
  searchBox,
  searchEngine,
  searchStatus,
} from '@/coveo/headless';
import { CategoryTabs } from '@/coveo/Tab/CategoryTabs';
import { Pagination } from '@/coveo/Pagination';
import { QuerySummary } from '@/coveo/QuerySummary';
import { SearchResultHeader } from '@/components/SearchResultHeader';
import { SearchResultsContext } from '@/utils/context/SearchResultsContext';
import {
  SearchResultsList,
  SearchResultsListProps,
  isNewsAndEvents,
} from '@/coveo/SearchResultsList';
import { SortBy } from '@/coveo/SortBy';

import styles from './SearchResults.module.css';

export type SearchResultsProps = {
  title: string,
  variant?: SearchResultsListProps['variant'],
  noResults: ReactNode,
  link?: ReactNode,
  /* When type is latestNews, need topic for default disabled facet value */
  topic?: string | { value: string },
};

function SearchResults({
  title = 'Filter',
  variant = 'default',
  noResults,
  link,
  topic,
}: SearchResultsProps) {
  const router = useRouter();
  const isDesktop = useMediaQuery(BREAKPOINTS.md, true);
  const [checkResult, setCheckResult] = useState<boolean>(true);
  const [isMenuOpened, { close: closeMenu, open: openMenu }] = useDisclosure(false);
  const [, setSearchStatusState] = useState(searchStatus.state);
  const [clearAll, setClearAll] = useState<JSX.Element | undefined>(undefined);

  const headlessResultList = useMemo(
    () => resultList(),
    /* eslint-disable react-hooks/exhaustive-deps */
    [searchEngine, router.locale],
  );

  const SearchResultsContextValue = useMemo(
    () => ({
      clearAll,
      setClearAll,
    }),
    [
      clearAll,
    ],
  );

  const newsAndEvents = isNewsAndEvents(variant);
  /* News/Events page do not need the list of facets */
  const facets = (insideDrawer?: boolean) => <Facets insideDrawer={insideDrawer} variant={variant} topic={variant === 'latestNews' ? topic : undefined} />;

  const searchHeaderTitle = () => {
    if (newsAndEvents) {
      return (
        <Heading title={title} as={newsAndEvents ? 'h2' : 'h4'} className={clsx(styles.newsAndEventsHeader)}>
          <Button onClick={openMenu} type="button" variant="unstyled">
            Open
          </Button>
          {title}
        </Heading>
      );
    }
    if (isDesktop) {
      return (
        <Heading title={title} as={newsAndEvents ? 'h2' : 'h4'}>
          {title}
        </Heading>
      );
    }
    return (
      <Button onClick={openMenu} type="button" variant="unstyled">
        |||
      </Button>
    );
  };

  const searchHeaderQueryResults = () => {
    if (variant === 'program') {
      return <QuerySummary query={searchBox.state.value} />;
    }
    if (newsAndEvents) {
      return null;
    }
    return <CategoryTabs />;
  };

  const noResultDom = (
    <Box pos="relative" className={clsx( 'section', styles.noResult)}>
      {!checkResult ? (
        <>
          {noResults}
        </>
      ) : (
        <LoadingOverlay visible zIndex={1000} />
      )}
    </Box>
  );

  useEffect(() => {
    switch (variant) {
      case 'news':
      case 'latestNews':
        resetSearch();
        coveoAdvancedSearch(COVEO_CATEGORY, COVEO_CATEGORY_NEWS);
        break;
      case 'events':
        resetSearch();
        coveoAdvancedSearch(COVEO_CATEGORY, COVEO_CATEGORY_EVENTS);
        break;
      case 'program':
        resetSearch();
        coveoAdvancedSearch(COVEO_CATEGORY, COVEO_CATEGORY_PROGRAM);
        break;
      default:
        coveoAdvancedSearch(COVEO_CATEGORY, '');
        break;
    }

    /* subscribe the search status state */
    searchStatus.subscribe(() => setSearchStatusState(searchStatus.state))

    const unsubscribeManager = bindUrlManager({router});
    searchEngine.executeFirstSearch();
    return ()=>{
      unsubscribeManager();
      searchStatus.subscribe(() => {})
    };
  }, []);

  /* In case there is render the no result first */
  useEffect(() => {
    setTimeout(() => {
      setCheckResult(headlessResultList?.state?.results?.length > 0);
    }, 500);
  }, [headlessResultList?.state?.results]);

  return (
    <SearchResultsContext.Provider value={SearchResultsContextValue}>
      <Box
        pos="relative"
        className={clsx(styles.searchResult, {
          container: newsAndEvents,
        })}
        id="searchResults"
      >
        <SearchResultHeader
          middle={searchHeaderQueryResults()}
          right={<SortBy variant={variant} />}
          title={searchHeaderTitle()}
          variant={variant}
        />
        <QuerySummary query={searchBox.state.value}/>
        <Grid
          className={clsx(styles.resultContent, {
            [styles.resultContent__isNewsEvents]: newsAndEvents,
          })}
          gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}
        >
          {!newsAndEvents && (
            <Grid.Col span={isDesktop ? 3 : 12} className={clsx(styles.facets)}>
              {facets()}
            </Grid.Col>
          )}
          <Grid.Col
            key={uuidv5(
              `searchResultContainer`,
              uuidv5.URL,
            )}
            className={clsx(styles.resultList)}
            span={
              isDesktop &&  !newsAndEvents ? 9 : 12
            }
          >
            {headlessResultList?.state?.results?.length > 0 ? (
              <>
                <SearchResultsList variant={variant} />
                <div className={clsx(styles.pagination)}>
                  {variant === 'latestNews' ? (
                    link && <div className={clsx(styles.link)}>{link}</div>
                  ) : (
                    <Pagination />
                  )}
                </div>
              </>
            ) : (
              noResultDom
            )}
          </Grid.Col>
        </Grid>
        <Drawer.Root
          keepMounted
          className={clsx(
            styles.drawer,
            'theme theme__cream',
            { [styles.drawer__isNewsEvents]: newsAndEvents },
          )}
          onClose={closeMenu}
          opened={isMenuOpened}
          portalProps={{ target: '#modal' }}
          position={isDesktop && newsAndEvents ? 'left' : 'right'}
          size={isDesktop && newsAndEvents ? undefined : '80%'}
        >
          <Drawer.Overlay className={clsx(styles.overlay)} />
          <Drawer.Content className={clsx(styles.drawerContent)}>
            <Drawer.Header
              className={clsx(
                styles.bar,
                styles.drawerHeader,
                'theme theme__cream',
              )}
            >
              <Drawer.Title
                className={clsx('body-m-compact', styles.drawerTitle)}
              >
                {title}
                {variant === 'default' && clearAll && (
                  <div className={clsx(styles.clearAllMobile)}>{clearAll}</div>
                )}
              </Drawer.Title>
              <Drawer.CloseButton className={clsx(styles.closeDrawer)}>
                X
              </Drawer.CloseButton>
            </Drawer.Header>
            <Drawer.Body
              className={clsx('theme theme__cream', styles.drawerBody)}
            >
              {facets(true)}
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Root>
      </Box>
    </SearchResultsContext.Provider>
  );
}

export default dynamic(() => Promise.resolve(SearchResults), {
  ssr: false,
});
