import type { FeedItem } from 'lens';
import type { FC } from 'react';

import Commented from './Commented';

interface TimelineThreadsProps {
  feedItem: FeedItem;
}

const TimelineThreads: FC<TimelineThreadsProps> = ({ feedItem }) => {
  const publication = feedItem.root;
  const isComment = publication.__typename === 'Comment';
  const showThread = isComment || (feedItem.comments?.length ?? 0 > 0);

  return showThread ? <Commented feedItem={feedItem} /> : null;
};

export default TimelineThreads;
