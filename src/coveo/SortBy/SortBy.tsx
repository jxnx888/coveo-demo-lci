import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { Menu } from '@mantine/core';
import { v5 as uuidv5 } from 'uuid';

import { Select } from '@mantine/core';
import { SearchResultsListProps, isNewsAndEvents } from '../SearchResultsList';
import {
  publishAscendingSortCriterion,
  publishDescendingSortCriterion,
  relevanceSortCriterion,
  searchEngine,
  sort,
  sortFieldName,
  titleAscendingSortCriterion,
  titleDescendingSortCriterion,
} from '../headless';
import { Button } from '@mantine/core';

import styles from './SortBy.module.css';

type SortByItemProps = {
  label: string,
  value: 'relevancy' | '@lci_page_title ascending' | '@lci_page_title descending',
};

type SortByProps = {
  variant?: SearchResultsListProps['variant'],
};

export function SortBy({ variant = 'default' }: SortByProps) {
  const relevanceCriterion = relevanceSortCriterion();
  const titleAscendingSort = titleAscendingSortCriterion();
  const titleDescendingSort = titleDescendingSortCriterion();
  const publishAscendingSort = publishAscendingSortCriterion();
  const publishDescendingSort = publishDescendingSortCriterion();
  const headlessSort = useMemo(
    () => sort(),
    /* eslint-disable react-hooks/exhaustive-deps */
    [searchEngine],
  );
  const [opened, setOpened] = useState(false);

  const [sortState, setSortState] = useState(headlessSort.state);

  useEffect(
    () => {
      headlessSort.subscribe(() => setSortState(headlessSort.state));
      return headlessSort.subscribe(() => {});
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [],
  );

  useEffect(() => {
    if (variant === 'latestNews') {
      headlessSort.sortBy(publishDescendingSort);
    }
  }, []);
  const sortItems: Array<SortByItemProps> = [
    {
      label: 'RELEVANCE',
      value: 'relevancy',
    },
    {
      label: 'A_TO_Z',
      value: `@${sortFieldName} ascending`,
    },
    {
      label:'Z_TO_A',
      value: `@${sortFieldName} descending`,
    },
  ];
  const changeSortHandler = (value: string | null) => {
    switch (value) {
      case sortItems[1].value:
        headlessSort.sortBy(titleAscendingSort);
        break;
      case sortItems[2].value:
        headlessSort.sortBy(titleDescendingSort);
        break;
      default:
        headlessSort.sortBy(relevanceCriterion);
        break;
    }
  };

  const newsAndEventsSortItems = [
    {
      title: 'Title',
      values: [
        {
          label: 'A_TO_Z',
          value: `@${sortFieldName} ascending`,
        },
        {
          label: 'Z_TO_A',
          value: `@${sortFieldName} descending`,
        },
      ],
    },
  ];

  const newsAndEvents = isNewsAndEvents(variant);

  const changeNewsAndEventSortHandler = (title: string, value: string) => {
    switch (title) {
      case newsAndEventsSortItems[0].title:
        switch (value) {
          case newsAndEventsSortItems[0].values[0].value:
            headlessSort.sortBy(titleAscendingSort);
            break;
          default:
            headlessSort.sortBy(titleDescendingSort);
        }
        break;
      default:
        switch (value) {
          case newsAndEventsSortItems[1].values[0].value:
            headlessSort.sortBy(publishDescendingSort);
            break;
          default:
            headlessSort.sortBy(publishAscendingSort);
        }
    }
  };

  if (newsAndEvents) {
    return (
      <section className={clsx(styles.sort, styles.sort__newsAndEvents)}>
        {newsAndEventsSortItems.map((item) => (
          <div key={item.title} className={clsx(styles.newsEventsFilter)}>
            <div className={clsx(styles.menu)}>
              {[
                {
                  toggle: <div>{item.title}</div>,
                  items: item.values.map((childItem) => ({
                    children: childItem.label,
                    onClick: () => changeNewsAndEventSortHandler(item.title, childItem.value),
                  })),
                },
              ].map((filter, index) => (
                <div className={clsx(styles.button)} key={uuidv5(`item-${index}`, uuidv5.URL)}>
                  <Menu
                    offset={4}
                    onChange={setOpened}
                    opened={opened}
                    position="bottom-start"
                  >
                    <Menu.Target>
                      <Button
                        className={clsx('body-m', styles.toggle)}
                        type="button"
                        variant="unstyled"
                      >
                        {filter.toggle}
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown className={clsx(styles.dropdown)}>
                      <ul className={clsx(styles.list)}>
                        {filter.items.map((item, i) => (
                          <li
                            className={clsx(styles.item)}
                            key={uuidv5(`item-${i}`, uuidv5.URL)}
                          >
                            <Menu.Item
                              {...item}
                              className={clsx('body-m', styles.link)}
                              component={Button}
                            />
                          </li>
                        ))}
                      </ul>
                    </Menu.Dropdown>
                  </Menu>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    );
  }
  return (
    <section className={clsx(styles.sort)}>
      {/* TODO: need to replace by i18n */}
      <div className={clsx(styles.title)}>{'SORT_BY'}</div>
      <Select
        data={sortItems}
        onChange={changeSortHandler}
        value={sortState.sortCriteria as SortByItemProps['value']}
        variant="sortBy"
      />
    </section>
  );
}
