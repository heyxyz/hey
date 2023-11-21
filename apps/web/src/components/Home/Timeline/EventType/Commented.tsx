import ThreadBody from '@components/Publication/ThreadBody';
import type { FeedItem } from '@hey/lens';
import { type FC } from 'react';

interface CommentedProps {
  feedItem: FeedItem;
}

const Commented: FC<CommentedProps> = ({ feedItem }) => {
  const { root } = feedItem;
  const rootCommentParent = root.__typename === 'Comment' && root?.commentOn;

  return (
    <>
      {rootCommentParent ? (
        <ThreadBody publication={rootCommentParent} />
      ) : null}
      <ThreadBody publication={root} />
    </>
  );
};

export default Commented;
