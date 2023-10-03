import stopEventPropagation from '@hey/lib/stopEventPropagation';
import type { MarkupLinkProps } from '@hey/types/misc';
import Link from 'next/link';
import type { FC } from 'react';

const ExternalLink: FC<MarkupLinkProps> = ({ href, title = href }) => {
  if (!href) {
    return null;
  }

  const hasProtocol = href.includes('://');
  const isValidSimpleLink =
    href.split('.').length > 1 && href.split(' ').length === 1;

  if (!hasProtocol && isValidSimpleLink) {
    href = `https://${href}`;
  } else if (!hasProtocol && !isValidSimpleLink) {
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
