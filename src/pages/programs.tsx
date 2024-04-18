import React from 'react';
import SearchResults from '@/components/SearchResults/SearchResults';

export type HeaderProps = {}

export default function Programs() {
  return (
    <div>
      <SearchResults title={'Filter'} noResults={'No Data'} variant={'program'}/>
    </div>
  );
}
