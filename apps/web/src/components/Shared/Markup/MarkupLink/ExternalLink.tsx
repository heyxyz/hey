import { stopEventPropagation } from '@lib/stopEventPropagation';
import Link from 'next/link';
import type { FC } from 'react';
import type { MarkupLinkProps } from 'src/types';

const ExternalLink: FC<MarkupLinkProps> = ({ href, title = href }) => {
  if (!href) {
    return null;
  }

  return (
    <Link
      href={href}
      onClick={stopEventPropagation}
      target={href.includes(location.host) ? '_self' : '_blank'}
      rel="noopener"
    >
      {title}
    </Link>
  );
};

export default ExternalLink;
