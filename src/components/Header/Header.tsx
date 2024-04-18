import { CoveoSearchBox } from "@/components/CoveoSearchBox";
import { useRouter } from "next/router";
import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
export default function Header() {
  const router = useRouter();
  return (
    <div className={styles.header}>
      <Link href={'/'} className={router.route === '/' ? styles.active : ''}>Home</Link>
      <Link href={'/search'} className={router.route === '/search' ? styles.active : ''}>Search</Link>
      <Link href={'/programs'} className={router.route === '/programs' ? styles.active : ''}>Programs</Link>
      <Link href={'/programs?f-facultiesAndSchools=artDesignCommunication'} >Programs - artDesignCommunication</Link>
      <CoveoSearchBox  accessibilitySearch={'search'} placeholder={'Search'}   error={'Please input'} />
    </div>
  );
}
