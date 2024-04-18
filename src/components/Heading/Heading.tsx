import { HTMLAttributes } from 'react';

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  /** Different Dom tag for the Heading. Default is `h1`. */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
};

export function Heading({
  as: HeadingTag = 'h1',
  children,
  className,
  ...rest
}: HeadingProps) {
  return (
    <HeadingTag
      className={className}
      {...rest}
    >
      {children}
    </HeadingTag>
  );
}
