import ThreadBody from '@components/Publication/ThreadBody';
import type { LensterPublication } from '@generated/lenstertypes';
import type { Comment, FeedItem } from '@generated/types';
import type { FC } from 'react';

interface Props {
  feedItem: FeedItem;
}

const Commented: FC<Props> = ({ feedItem }) => {
  const publication = feedItem.root as Comment;
  const firstComment = feedItem.comments && feedItem.comments[0];

  return (
    <span>
      {firstComment ? (
        <ThreadBody isMirror={false} publication={publication as LensterPublication} />
      ) : (
        <ThreadBody isMirror={false} publication={publication?.commentOn as LensterPublication} />
      )}
    </span>
  );
};

export default Commented;
