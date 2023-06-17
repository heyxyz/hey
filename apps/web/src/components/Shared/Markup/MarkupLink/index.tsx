import truncateUrl from '@lenster/lib/truncateUrl';
import type { MarkupLinkProps } from 'src/types';

import ExternalLink from './ExternalLink';
import Hashtag from './Hashtag';
import Mention from './Mention';

const MarkupLink = ({ href, title = href }: MarkupLinkProps) => {
  if (!href) {
    return null;
  }

  // Mentions
  if (href.startsWith('@')) {
    return <Mention href={href} title={title} />;
  }

  // Hashtags
  if (href.startsWith('#')) {
    return <Hashtag href={href} title={title} />;
  }

  return (
    <ExternalLink href={href} title={title ? truncateUrl(title, 30) : title} />
  );
};

export default MarkupLink;
