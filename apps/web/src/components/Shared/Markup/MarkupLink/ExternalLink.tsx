import type { MarkupLinkProps } from '@hey/types/misc';
import Link from 'next/link';
import type { FC } from 'react';

import { isUrlContainsValidTld } from '../../../../../../../packages/data/utils/check_valid_tld';

const ExternalLink: FC<MarkupLinkProps> = ({ href, title = href }) => {
  if (!href) {
    return null;
  }

  if (!isUrlContainsValidTld(href)) {
    // if href not contains valid tld then we will not render as link

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
      {title}
    </Link>
  );
};

export default ExternalLink;
