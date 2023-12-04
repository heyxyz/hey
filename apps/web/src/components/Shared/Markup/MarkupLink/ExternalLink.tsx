import { isUrlContainsValidTld } from '@hey/lib/check_valid_tld';
import truncateUrl from '@hey/lib/truncateUrl';
import type { MarkupLinkProps } from '@hey/types/misc';
import Link from 'next/link';
import { type FC } from 'react';

const ExternalLink: FC<MarkupLinkProps> = ({ title }) => {
  let href = title;

  if (!href) {
    return null;
  }

  if (!isUrlContainsValidTld(href)) {
    return href;
  }

  if (!href.includes('://')) {
    href = `https://${href}`;
  }

  return (
    <Link
      href={href}
      target={href.includes(location.host) ? '_self' : '_blank'}
      rel="noopener"
    >
      {title ? truncateUrl(title, 30) : title}
    </Link>
  );
};

export default ExternalLink;
