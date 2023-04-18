import type { FeedItem } from 'lens';
import { stopEventPropagation } from 'lib/stopEventPropagation';
import type { FC } from 'react';

import Collected from './Collected';
import Combined from './Combined';
import Commented from './Commented';
import Liked from './Liked';
import Mirrored from './Mirrored';

const getCanCombined = (aggregations: number[]) => {
  // show combined reactions if more than 2 items in aggregations
  return aggregations.filter((n) => n > 0).length > 1;
};

interface ActionTypeProps {
  feedItem: FeedItem;
}

const ActionType: FC<ActionTypeProps> = ({ feedItem }) => {
  const publication = feedItem.root;
  const isComment = publication.__typename === 'Comment';
  const showThread = isComment || (feedItem.comments?.length ?? 0 > 0);

  const canCombined = getCanCombined([
    feedItem.mirrors.length,
    feedItem.reactions.length,
    feedItem.collects.length,
    feedItem.comments?.length ?? 0
  ]);

  return (
    <span onClick={stopEventPropagation} aria-hidden="true">
      {canCombined ? (
        <Combined feedItem={feedItem} />
      ) : (
        <>
          {feedItem.mirrors.length && !isComment ? <Mirrored mirrors={feedItem.mirrors} /> : null}
          {feedItem.collects.length && !isComment ? <Collected collects={feedItem.collects} /> : null}
          {feedItem.reactions.length && !isComment ? <Liked reactions={feedItem.reactions} /> : null}
        </>
      )}
      {showThread ? <Commented feedItem={feedItem} /> : null}
    </span>
  );
};

export default ActionType;
