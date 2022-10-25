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

const getCanCombined = (aggregations: number[]) => {
  // show combined reactions if more than 2 items in aggregations
  return aggregations.filter((n) => n > 0).length > 1;
};

const EventType: FC<Props> = ({ feedItem, showType, showThread = false }) => {
  const publication = feedItem.root;
  const isComment = publication.__typename === 'Comment';
  const commentsCount = feedItem.comments?.length ?? 0;

  const canCombined = getCanCombined([
    feedItem.mirrors.length,
    feedItem.reactions.length,
    feedItem.collects.length,
    feedItem.comments?.length ?? 0
  ]);

  if (!showType) {
    return null;
  }

  return (
    <>
      {canCombined ? (
        <Combined feedItem={feedItem} />
      ) : (
        <>
          {feedItem.mirrors.length && !isComment ? <Mirrored mirrors={feedItem.mirrors} /> : null}
          {feedItem.collects.length && !isComment ? <Collected collects={feedItem.collects} /> : null}
          {feedItem.reactions.length && !isComment ? <Reacted reactions={feedItem.reactions} /> : null}
        </>
      )}
      {(isComment || commentsCount > 0) && showThread && <Commented feedItem={feedItem} />}
    </>
  );
};

export default EventType;
