import clsx from 'clsx';
import { Pagination as MantinePagination } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { BREAKPOINTS } from '@/utils/breakpoints';

import styles from './Pagination.module.css';

export type PaginationProps = {
  currentPage: number,
  setCurrentPage: (page: number) => void,
  totalPage: number,
};
export function Pagination({
  currentPage,
  setCurrentPage,
  totalPage,
}: PaginationProps) {
  const isTablet = useMediaQuery(BREAKPOINTS.sm, true);
  return (
    <div className={clsx(styles.wrapper)}>
      <MantinePagination
        total={totalPage}
        value={currentPage}
        onChange={setCurrentPage}
        siblings={isTablet ? 1 : 0}
        boundaries={isTablet ? 2 : 1}
      />
    </div>
  );
}
