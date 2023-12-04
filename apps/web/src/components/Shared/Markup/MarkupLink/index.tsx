import type { MarkupLinkProps } from '@hey/types/misc';

import ExternalLink from './ExternalLink';
import Hashtag from './Hashtag';
import Mention from './Mention';

const MarkupLink = ({ mentions, title }: MarkupLinkProps) => {
  if (!title) {
    return null;
  }

  if (title.startsWith('@')) {
    return <Mention mentions={mentions} title={title} />;
  }

  if (title.startsWith('#')) {
    return <Hashtag title={title} />;
  }

  return <ExternalLink title={title} />;
};

export default MarkupLink;
