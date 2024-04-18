import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { buildResultsPerPage } from '@coveo/headless';
import { Group, Radio } from '@mantine/core';
import { v5 as uuidv5 } from 'uuid';
import styles from './ResultsPerPage.module.css';
import { searchEngine } from '../headless';

export function ResultsPerPage() {
  const pagination = [10, 25, 50, 100];
  const headlessResultsPerPage = buildResultsPerPage(searchEngine, {
    initialState: { numberOfResults: pagination[0] },
  });

  const [, setSearchState] = useState(headlessResultsPerPage.state);
  const [current, setCurrent] = useState<number>(pagination[0]);
  const onChange = (value: string) => {
    const changeTo = parseInt(value, 10);
    headlessResultsPerPage.set(changeTo);
    setCurrent(changeTo);
  };

  useEffect(() => {
    const unsub = headlessResultsPerPage.subscribe(() => {
      setSearchState(headlessResultsPerPage.state);
    });
    return function cleanup() {
      unsub();
    };
    // Do not add the dependency on headlessResultsPerPage, otherwise it will cause infinite loop
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  useEffect(() => {
    setCurrent(headlessResultsPerPage.state.numberOfResults);
  }, [headlessResultsPerPage.state.numberOfResults]);

  return (
    <Radio.Group
      label="How many results per page?"
      value={String(current)}
      onChange={onChange}
      className={clsx(styles.resultsPerPage)}
    >
      <Group mt="xs">
        {pagination.map((item, index) => (
          <Radio
            key={uuidv5(`item-${index}`, uuidv5.URL)}
            value={String(item)}
            label={item}
            className={clsx(styles.radio)}
          />
        ))}
      </Group>
    </Radio.Group>
  );
}
