import clsx from 'clsx';
import { ReactNode } from 'react';

import { isNewsAndEvents, SearchResultsListProps } from '@/coveo/SearchResultsList';

import styles from './SearchResultHeader.module.css';

export type SearchResultHeaderProps = {
  middle?: ReactNode,
  right: ReactNode,
  title: ReactNode,
  variant?: SearchResultsListProps['variant'],
};

export function SearchResultHeader({
  middle,
  right,
  title,
  variant = 'default',
}: SearchResultHeaderProps) {
  const newsAndEvents = isNewsAndEvents(variant);

  return (
    <div className={clsx(
      styles.wrapper,
      { [styles.wrapper__noTitle]: !title },
      { [styles.wrapper__isNewsEvents]: newsAndEvents },
    )}
    >
      {title && title}
      {middle}
      {right && (
      <div className={clsx(
        styles.sortBy,
        { [styles.sortBy__isNewsEvents]: newsAndEvents },
      )}
      >
        {right}
      </div>
      )}
    </div>
  );
}
