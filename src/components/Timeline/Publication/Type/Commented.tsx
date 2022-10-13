import type { LensterPublication } from '@generated/lenstertypes';
import type { Comment, FeedItem } from '@generated/types';
import type { FC } from 'react';

import ThreadBody from '../ThreadBody';

interface Props {
  feedItem: FeedItem;
}

const Commented: FC<Props> = ({ feedItem }) => {
  const publication = feedItem.root as Comment;

  const commentOn = publication?.commentOn as LensterPublication;
  const mainPost = commentOn?.mainPost as LensterPublication;

  return (
    <>
      {mainPost ? <ThreadBody publication={mainPost} /> : null}
      {/* {commentOn && <ThreadBody publication={commentOn} />} */}
    </>
  );
};

export default Commented;
