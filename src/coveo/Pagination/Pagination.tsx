import { useEffect, useState } from 'react';

import { Pagination as PaginationComponent } from '@/components/Pagination';

import { pager } from '../headless';

export function Pagination() {
  const headlessPagination = pager(3);
  const [paginationState, setPaginationState] = useState(
    headlessPagination.state,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const handleSetCurrentPage = (page: number) => {
    setCurrentPage(page);
    headlessPagination.selectPage(page);
    const searchResultDom = document.getElementById('searchResults');
    if (searchResultDom) {
      const { offsetTop } = searchResultDom;
      window.scrollTo(0, offsetTop - 100);
    } else {
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    setCurrentPage(paginationState.currentPage);
    setTotalPage(paginationState.maxPage);
  }, [paginationState]);

  useEffect(
    () => {
      headlessPagination.subscribe(() => setPaginationState(headlessPagination.state));
      return headlessPagination.subscribe(() => {});
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [],
  );

  return (
    <section>
      <PaginationComponent
        totalPage={totalPage}
        currentPage={currentPage}
        setCurrentPage={handleSetCurrentPage}
      />
    </section>
  );
}
