import ThreadBody from '@components/Publication/ThreadBody';
import type { FeedItem } from '@hey/lens';
import type { FC } from 'react';

interface CommentedProps {
  feedItem: FeedItem;
}

const Commented: FC<CommentedProps> = ({ feedItem }) => {
  const { root, comments } = feedItem;
  const firstComment = comments?.[0];
  const firstCommentParent = root.__typename === 'Comment' && root?.commentOn;

  return firstComment ? (
    <>
      {firstCommentParent ? (
        <ThreadBody publication={firstCommentParent} />
      ) : null}
      <ThreadBody publication={root} />
    </>
  ) : firstCommentParent ? (
    <ThreadBody publication={firstCommentParent} />
  ) : null;
};

export default Commented;
