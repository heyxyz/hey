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
  const commentOn: LensterPublication | any = publication?.commentOn;
  const mainPost = commentOn?.mainPost;

  return firstComment && !commentOn ? (
    <ThreadBody publication={publication as LensterPublication} />
  ) : commentOn ? (
    <>
      {mainPost ? <ThreadBody publication={mainPost} /> : null}
      <ThreadBody publication={commentOn as LensterPublication} />
    </>
  ) : null;
};

export default Commented;
