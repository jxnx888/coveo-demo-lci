import clsx, { ClassValue } from 'clsx';
import NextLink from 'next/link';
import { createContext, ReactElement, ReactNode, useContext } from 'react';

import { getHref, LinkProps as LinkUniformProps } from '@/utils/hrefDetector';

import styles from './Card.module.css';

export type CardProps = {
  animation?: 'default' | 'shrink',
  classNames?: { [key: string]: ClassValue },
  description?: ReactNode,
  disabled?: boolean,
  extraLinks?: ReactElement,
  features?: ReactElement,
  // NOTE: filterId is only used in parent components
  // eslint-disable-next-line react/no-unused-prop-types
  filterId?: string,
  href?: LinkUniformProps,
  image?: ReactElement,
  imageRatio?: '3x4' | '4x3' | '1x1',
  isFeaturesEmphasized?: boolean,
  linkVariant?: 'default' | 'chevronOnly' | 'hidden',
  overlineText?: string,
  subtitle?: string,
  tags?: ReactElement,
  textAlignment?: 'top' | 'bottom',
  title: string,
  variant?: 'default' | 'horizontal' | 'horizontalReversed' | 'symbol',
  symbol?: JSX.Element,
};

export function Card({
  animation = 'default',
  classNames,
  description,
  disabled = false,
  extraLinks,
  features,
  href: link,
  image,
  imageRatio = '4x3',
  isFeaturesEmphasized = false,
  linkVariant = 'chevronOnly',
  overlineText,
  subtitle,
  tags,
  textAlignment = 'top',
  title,
  variant: cardVariant = 'default',
  filterId,
  symbol,
}: CardProps) {
  type CardContextType = {
    showImage?: boolean,
    variant: string,
  };
  const CardContext = createContext<CardContextType>({
    showImage: true,
    variant: cardVariant,
  });

  const { variant: variantOverride, showImage = true } = useContext(CardContext);

  const variant = variantOverride || cardVariant;

  const isRoundedCard = !!extraLinks;
  const titleFontClass = ['horizontal', 'horizontalReversed'].includes(variant) && image ? 'body-l-compact' : 'h4';
  const titleFontClassForSymbol = ['symbol'].includes(variant) ? 'body-l-compact' : 'h4';
  const href = getHref(link);

  return (
    <div
      className={clsx(
        styles.card,
        'moleculeCard',
      )}
      id={filterId}
    >
      <div className={clsx(styles.inner, 'moleculeCardInner')}>
        {!!image && showImage && (
          <div
            className={clsx(
              { [styles.card__withShrinkHover]: image && href && animation === 'shrink' },
              styles.header,
              { [styles.header__isSquare]: imageRatio === '1x1' },
              { [styles.header__3v4]: imageRatio === '3x4' },
              'moleculeCardHeader',
            )}
          >
            {image}
          </div>
        )}
        {!!symbol && (
          <div
            className={clsx(
              styles.header,
              { [styles.header__isSquare]: imageRatio === '1x1' },
              'moleculeCardHeader',
            )}
          >
            {symbol}
          </div>
        )}
        <div
          className={clsx(
            styles.body,
            classNames?.body,
            { [styles.body__withFeatures]: !!features },
            { [styles.body__hasFeaturesAndChevronHidden]: linkVariant === 'hidden' && !!features },
            'moleculeCardBody',
          )}
        >
          <div className={clsx(styles.text, { [styles.text__alignBottom]: textAlignment === 'bottom' })}>
            {overlineText && <div className={clsx(styles.overline)}>{overlineText}</div>}
            <div className={clsx(
              titleFontClass,
              titleFontClassForSymbol,
              styles.title,
              classNames?.title,
              'moleculeCardTitle',
            )}
            >
              {title}
            </div>
            {subtitle && <div className={clsx(styles.subtitle, 'body-s-compact')}>{subtitle}</div>}
            {tags && <ul className={clsx(styles.tags)}>{tags}</ul>}
            {description && (
              <div
                className={clsx(
                  'prose',
                  styles.description,
                  classNames?.description,
                  { [styles.description__alignTop]: textAlignment === 'top' },
                  'moleculeCardDescription',
                )}
              >
                {description}
              </div>
            )}
            {description && features && <hr />}
            {features && (
              <ul
                className={clsx('body-s-compact', styles.features, {
                  [styles.features__isEmphasized]: isFeaturesEmphasized,
                })}
              >
                {features}
              </ul>
            )}
            {extraLinks && (
              <div className={clsx(styles.extraLinks)}>
                {extraLinks}
              </div>
            )}
          </div>
          {href && (
            // stretch link - see: https://getbootstrap.com/docs/5.0/helpers/stretched-link/
            <NextLink
              className={clsx('body-s-compact', styles.link, {
                [styles.link__chevronOnly]: linkVariant === 'chevronOnly',
              })}
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
