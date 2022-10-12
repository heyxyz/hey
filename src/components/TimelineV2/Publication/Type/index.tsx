import type { FeedItem } from '@generated/types';
import type { FC } from 'react';

import Collected from './Collected';
import Combined from './Combined';
import Commented from './Commented';
import Mirrored from './Mirrored';
import Reacted from './Reacted';

interface Props {
  feedItem: FeedItem;
  showType?: boolean;
  showThread?: boolean;
}

const getCanCombined = (lengths: number[]) => {
  return lengths.filter((n) => n > 0).length > 0;
};

const PublicationType: FC<Props> = ({ feedItem, showType, showThread = false }) => {
  const publication = feedItem.root;
  const type = publication.__typename;
  const canCombined = getCanCombined([
    feedItem.mirrors.length,
    feedItem.reactions.length,
    feedItem.collects.length,
    feedItem.comments?.length ?? 0
  ]);

  if (!showType) {
    return null;
  }

  return canCombined ? (
    <Combined feedItem={feedItem} />
  ) : (
    <>
      {feedItem.mirrors.length ? <Mirrored mirrors={feedItem.mirrors} /> : null}
      {/* {feedItem.comments?.length ? <CommentedPublication comments={feedItem.comments} /> : null} */}
      {type === 'Comment' && showThread && <Commented feedItem={feedItem} />}
      {feedItem.collects.length ? <Collected collects={feedItem.collects} /> : null}
      {feedItem.reactions.length ? <Reacted reactions={feedItem.reactions} /> : null}
    </>
  );
};

export default PublicationType;
