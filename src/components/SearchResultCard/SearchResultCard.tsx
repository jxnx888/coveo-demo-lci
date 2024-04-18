import clsx, { ClassValue } from 'clsx';
import NextLink from 'next/link';
import { ReactNode } from 'react';
import { getHref, LinkProps as LinkUniformProps } from '@/utils/hrefDetector';

import styles from './SearchResultCard.module.css';

export type SearchResultCardProps = {
  classNames?: { [key: string]: ClassValue },
  description?: ReactNode,
  disabled?: boolean,
  features?: JSX.Element,
  // NOTE: filterId is only used in parent components
  // eslint-disable-next-line react/no-unused-prop-types
  filterId?: string,
  href?: LinkUniformProps,
  image?: JSX.Element,
  linkVariant?: 'default' | 'hidden',
  tags?: JSX.Element,
  title: string,
};

export function SearchResultCard({
  classNames,
  description,
  disabled = false,
  features,
  href: link,
  image,
  linkVariant = 'default',
  tags,
  title,
  filterId,
}: SearchResultCardProps) {
  const titleFontClass = image ? 'body-l-compact' : 'h4';
  const href = getHref(link);
  return (
    <div
      className={clsx(
        styles.card,
        { [styles.card__isDisabled]: disabled },
        { [styles.card__withBackgroundColorHover]: !image && href },
        { [styles.card__withImageTransitionHover]: image && href },
        'moleculeCard',
      )}
      id={filterId}
    >
      <div className={clsx(styles.inner)}>
        {image && (
          <div
            className={clsx(
              styles.header,
              'moleculeCardHeader',
            )}
          >
            {image}
          </div>
        )}
        <div
          className={clsx(
            styles.body,
            classNames?.body,
            { [styles.body__hasFeaturesAndChevronHidden]: linkVariant === 'hidden' && !!features },
            'moleculeCardBody',
          )}
        >
          <div className={clsx(styles.text)}>
            <div className={clsx(titleFontClass, styles.title, classNames?.title)}>{title}</div>
            {tags && <ul className={clsx(styles.tags)}>{tags}</ul>}
            {description && (
              <div
                className={clsx(
                  'prose',
                  styles.description,
                  classNames?.description,
                  'moleculeCardDescription',
                )}
              >
                {description}
              </div>
            )}
            {features && (
              <ul
                className={clsx('body-s-compact', styles.features, {
                })}
              >
                {features}
              </ul>
            )}
          </div>
          {href && (
            // stretch link - see: https://getbootstrap.com/docs/5.0/helpers/stretched-link/
            <NextLink
              className={clsx('body-s-compact', styles.link)}
              href={href}
              tabIndex={disabled ? -1 : undefined}
            >
              <span className={linkVariant !== 'default' ? 'visuallyHidden' : undefined}>{title}</span>
            </NextLink>
          )}
        </div>
      </div>
    </div>
  );
}
