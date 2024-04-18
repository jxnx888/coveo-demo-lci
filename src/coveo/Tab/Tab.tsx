import clsx from 'clsx';
import React, { useMemo } from 'react';
import { searchEngine } from '../headless';
import { searchTab } from '@/coveo/headless/buildTab';
import { Button } from '@mantine/core';

import styles from './Tab.module.css';

export type TabProps = {
  id: string,
  expression: string,
  selected?: boolean,
  label: string,
};
export function Tab({ id, expression, selected, label }: TabProps) {
  const headlessTab = useMemo(
    () => searchTab({ expression, id }),
    /* eslint-disable react-hooks/exhaustive-deps */
    [searchEngine],
  );

  return (
    <Button
      className={clsx(styles.tab, {
        [styles.tab__active]: selected,
      })}
      onClick={() => headlessTab.select()}
      variant="unstyled"
    >
      {label}
    </Button>
  );
}
