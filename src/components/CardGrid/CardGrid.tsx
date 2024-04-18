import clsx from 'clsx';
import { ReactNode, createContext } from 'react';

import { Button } from '@mantine/core';
import { Pagination, PaginationProps } from '@/components/Pagination';

import styles from './CardGrid.module.css';

export const CardGridColumnsContext = createContext<CardGridProps['columns']>('1');

export type CardGridProps = {
  carousel?: ReactNode,
  /* Columns for PC */
  /* Of type 'string' rather than 'number' as Uniform doesn't let us add 'number' dropdown options */
  columns?: '1' | '2' | '3' | '4',
  items?: ReactNode,
  link?: ReactNode,
  pagination?: PaginationProps,
  title?: string,
  viewMoreClick?: () => void,
  viewAllLink?: ReactNode,
  hasContainer?: boolean,
};

export function CardGrid({
  carousel,
  columns = '3',
  items,
  link,
  pagination,
  title,
  viewMoreClick,
  viewAllLink,
  hasContainer,
}: CardGridProps) {
  return (
    <div className={clsx(
      styles.cardGrid,
    )}
    >
      <div className={clsx({ container: hasContainer })}>
        <CardGridColumnsContext.Provider value={columns}>
          <ul
            className={clsx(
              styles.list,
              styles[`list__columns${columns}`],
              { [styles.list__withCarousel]: carousel },

            )}
          >
            {items && carousel && (
              <li className={clsx(styles.item, styles.carouselItem)}>
                <div className={clsx(styles.innerCarousel)}>{carousel}</div>
              </li>
            )}
            {items}
          </ul>
        </CardGridColumnsContext.Provider>

        {pagination && (
          <div className={clsx(styles.pagination)}>
            <Pagination {...pagination} />
          </div>
        )}

        {link && !pagination && (
          <div className={clsx(styles.link)}>
            {link}
          </div>
        )}

        {
          viewMoreClick && (
            <div className={clsx(styles.viewMore)}>
              <Button
                onClick={viewMoreClick}
              >
                View more
              </Button>
            </div>
          )
        }
      </div>
    </div>
  );
}
