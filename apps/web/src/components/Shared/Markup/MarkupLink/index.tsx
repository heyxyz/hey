import truncateUrl from '@hey/lib/truncateUrl';
import type { MarkupLinkProps } from '@hey/types/misc';

import ExternalLink from './ExternalLink';
import Hashtag from './Hashtag';
import Mention from './Mention';

const MarkupLink = ({ href, title = href, mentions }: MarkupLinkProps) => {
  if (!href) {
    return null;
  }

  // Mentions
  if (href.startsWith('@')) {
    return <Mention title={title} mentions={mentions} />;
  }

  // Hashtags
  if (href.startsWith('#')) {
    return <Hashtag title={title} />;
  }

  return (
    <ExternalLink href={href} title={title ? truncateUrl(title, 30) : title} />
  );
};

export default MarkupLink;
