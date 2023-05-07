'use client';
import ThreadBody from '@components/Publication/ThreadBody';
import type { FeedItem } from 'lens';
import type { FC } from 'react';

interface CommentedProps {
  feedItem: FeedItem;
}

const Commented: FC<CommentedProps> = ({ feedItem }) => {
  const publication = feedItem.root;
  const firstComment = feedItem.comments?.[0];
  const firstCommentParent =
    publication.__typename === 'Comment' && publication?.commentOn;

  return firstComment ? (
    <>
      {firstCommentParent ? (
        <ThreadBody publication={firstCommentParent} />
      ) : null}
      <ThreadBody publication={publication} />
    </>
  ) : firstCommentParent ? (
    <ThreadBody publication={firstCommentParent} />
  ) : null;
};

export default Commented;
