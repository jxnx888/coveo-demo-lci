import React, { useEffect, useState } from 'react';
import { v5 as uuidv5 } from 'uuid';
import { getUrlParam } from '@/utils/urlParam';
import {
  COVEO_CATEGORY,
  COVEO_CATEGORY_EVENTS,
  COVEO_CATEGORY_NEWS,
  COVEO_CATEGORY_PROGRAM,
  tabList,
} from '@/coveo/headless/searchbox';
import { Tab } from './Tab';

import styles from './Tab.module.css';

export function CategoryTabs() {
  const [selectedTab, setSelectedTab] = useState(tabList.all);
  const categoryTab = [
    {
      id: tabList.all,
      expression: '',
      label: 'ALL',
    },
    {
      id: tabList.news,
      expression: `@${COVEO_CATEGORY}==${COVEO_CATEGORY_NEWS}`,
      label: 'NEWS',
    },
    {
      id: tabList.events,
      expression: `@${COVEO_CATEGORY}==${COVEO_CATEGORY_EVENTS}`,
      label: 'EVENTS',
    },
    {
      id: tabList.programs,
      expression: `@${COVEO_CATEGORY}==${COVEO_CATEGORY_PROGRAM}`,
      label: 'PROGRAMS',
    },
  ];

  useEffect(() => {
    const tabValue = getUrlParam('tab');
    if (tabValue) {
      setSelectedTab(tabValue);
    }
  }, []);

  return (
    <div className={styles.middleTabs}>
      {
        categoryTab.map((tab, index) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
          <div
            key={uuidv5(`categoryTabs-${index}`, uuidv5.URL)}
            onClick={() => setSelectedTab(tab.id)}
          >
            <Tab
              id={tab.id}
              expression={tab.expression}
              label={tab.label}
              selected={selectedTab === tab.id}
            />
          </div>
        ))
      }
    </div>
  );
}
