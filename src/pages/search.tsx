import React from 'react';
import SearchResults from '@/components/SearchResults/SearchResults';

export type HeaderProps = {}

export default function Search() {
  return (
    <div>
      <SearchResults title={'Filter'} noResults={'No Data'}/>
    </div>
  );
}
