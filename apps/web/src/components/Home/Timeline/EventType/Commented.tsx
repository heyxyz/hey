import ThreadBody from '@components/Publication/ThreadBody';
import type { Comment, FeedItem } from 'lens';
import type { FC } from 'react';

interface Props {
  feedItem: FeedItem;
}

const Commented: FC<Props> = ({ feedItem }) => {
  const publication = feedItem.root as Comment;
  const firstComment = feedItem.comments && feedItem.comments[0];

  return firstComment ? (
    <ThreadBody publication={publication} />
  ) : publication?.commentOn ? (
    <ThreadBody publication={publication?.commentOn} />
  ) : null;
};

export default Commented;
