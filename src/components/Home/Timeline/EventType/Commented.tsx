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
  const commentOn = publication?.commentOn as LensterPublication;
  const mainPost = commentOn?.mainPost as LensterPublication;

  return firstComment ? (
    <ThreadBody publication={publication as LensterPublication} />
  ) : commentOn ? (
    <>
      {mainPost ? <ThreadBody publication={mainPost} /> : null}
      <ThreadBody publication={commentOn} />
    </>
  ) : null;
};

export default Commented;
