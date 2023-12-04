import type { MarkupLinkProps } from '@hey/types/misc';

import stopEventPropagation from '@hey/lib/stopEventPropagation';
import truncateUrl from '@hey/lib/truncateUrl';
import Link from 'next/link';
import { type FC } from 'react';

const ExternalLink: FC<MarkupLinkProps> = ({ title }) => {
  let href = title;

  if (!href) {
    return null;
  }

  if (!href.includes('://')) {
    href = `https://${href}`;
  }

  return (
    <Link
      href={href}
      onClick={stopEventPropagation}
      rel="noopener"
      target={href.includes(location.host) ? '_self' : '_blank'}
    >
      {title ? truncateUrl(title, 30) : title}
    </Link>
  );
};

export default ExternalLink;
