import NLink from 'next/link';
import React, { useMemo } from 'react';
import 'twin.macro';

export interface Props {
  children?: React.ReactNode;
  className?: string;
  external?: boolean;
  href: string;
  target?: string;
}

const isExternalLink = (href: string) =>
  href == null || href.startsWith('http://') || href.startsWith('https://');

const useIsExternalLink = (href: string) =>
  useMemo(() => isExternalLink(href), [href]);

export const Link: React.FC<Props> = ({
  children,
  external,
  href,
  ...props
}) => {
  const isExternal = (useIsExternalLink(href) || external) ?? false;

  if (isExternal) {
    return (
      <a href={href} rel="noreferrer" target="_blank" {...props}>
        {children}
      </a>
    );
  }

  return (
    <NLink href={href} passHref {...props}>
      {children}
    </NLink>
  );
};
