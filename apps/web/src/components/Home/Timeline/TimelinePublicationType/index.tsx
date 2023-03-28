import type { FeedItem } from 'lens';
import { stopEventPropagation } from 'lib/stopEventPropagation';
import type { FC } from 'react';

import Collected from './Collected';
import Combined from './Combined';
import Liked from './Liked';
import Mirrored from './Mirrored';

const getCanCombined = (aggregations: number[]) => {
  return aggregations.filter((n) => n > 0).length > 1;
};

interface TimelinePublicationTypeProps {
  feedItem: FeedItem;
}

const TimelinePublicationType: FC<TimelinePublicationTypeProps> = ({ feedItem }) => {
  const publication = feedItem.root;
  const isComment = publication.__typename === 'Comment';

  const canCombined = getCanCombined([
    feedItem.mirrors.length,
    feedItem.reactions.length,
    feedItem.collects.length,
    feedItem.comments?.length ?? 0
  ]);

  return (
    <div onClick={stopEventPropagation} className="px-5">
      {canCombined ? (
        <Combined feedItem={feedItem} />
      ) : (
        <>
          {feedItem.mirrors.length && !isComment ? <Mirrored mirrors={feedItem.mirrors} /> : null}
          {feedItem.collects.length && !isComment ? <Collected collects={feedItem.collects} /> : null}
          {feedItem.reactions.length && !isComment ? <Liked reactions={feedItem.reactions} /> : null}
        </>
      )}
    </div>
  );
};

export default TimelinePublicationType;
