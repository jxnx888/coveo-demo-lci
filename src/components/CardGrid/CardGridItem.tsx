import { useMediaQuery } from '@mantine/hooks';
import clsx from 'clsx';
import { ReactNode, createContext, useContext, useMemo } from 'react';

import { BREAKPOINTS } from '@/utils/breakpoints';
import { CardGridColumnsContext } from './CardGrid';

import styles from './CardGrid.module.css';

export type CardContextType = {
  showImage?: boolean,
  variant: string,
};

export const CardContext = createContext<CardContextType>({
  variant: 'default',
});

export type CardGridItemProps = {
  card: ReactNode,
};

export function CardGridItem({
  card,
}: CardGridItemProps) {
  const columns = useContext(CardGridColumnsContext);

  const isDesktop = useMediaQuery(BREAKPOINTS.md, true);

  const cardContextValue = useMemo<CardContextType>(() => {
    switch (columns) {
      case '1':
        return {
          showImage: isDesktop,
          variant: isDesktop ? 'horizontalReversed' : 'horizontal',
        };
      case '4':
        return {
          variant: isDesktop ? 'default' : 'horizontalReversed',
        };
      default:
        return {
          variant: 'default',
        };
    }
  }, [columns, isDesktop]);

  return (
    <li className={clsx(styles.item)}>
      <CardContext.Provider value={cardContextValue}>
        {card}
      </CardContext.Provider>
    </li>
  );
}
