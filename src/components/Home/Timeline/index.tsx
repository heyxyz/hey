import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import type { LensterPublication } from '@generated/lenstertypes';
import type { FeedItem } from '@generated/types';
import { FeedEventItemType, useTimelineQuery } from '@generated/types';
import { CollectionIcon } from '@heroicons/react/outline';
import type { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Virtuoso } from 'react-virtuoso';
import { SCROLL_THRESHOLD } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { useTimelinePersistStore } from 'src/store/timeline';
import { useTransactionPersistStore } from 'src/store/transaction';

const Timeline: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const feedEventFilters = useTimelinePersistStore((state) => state.feedEventFilters);

  const getFeedEventItems = () => {
    const filters: FeedEventItemType[] = [];
    if (feedEventFilters.posts) {
      filters.push(FeedEventItemType.Post, FeedEventItemType.Comment);
    }
    if (feedEventFilters.collects) {
      filters.push(FeedEventItemType.CollectPost, FeedEventItemType.CollectComment);
    }
    if (feedEventFilters.mirrors) {
      filters.push(FeedEventItemType.Mirror);
    }
    if (feedEventFilters.likes) {
      filters.push(FeedEventItemType.ReactionPost, FeedEventItemType.ReactionComment);
    }
    return filters;
  };

  // Variables
  const request = { profileId: currentProfile?.id, limit: 50, feedEventItemTypes: getFeedEventItems() };
  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;

  const { data, error, fetchMore } = useTimelineQuery({
    variables: { request, reactionRequest, profileId }
  });

  const publications = data?.feed?.items;
  const pageInfo = data?.feed?.pageInfo;
  const hasMore = pageInfo?.next && publications?.length !== pageInfo.totalCount;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
    });
  };

  if (publications?.length === 0) {
    return (
      <EmptyState
        message={<div>No posts yet!</div>}
        icon={<CollectionIcon className="w-8 h-8 text-brand" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load timeline" error={error} />;
  }

  return (
    <InfiniteScroll
      dataLength={publications?.length ?? 0}
      scrollThreshold={SCROLL_THRESHOLD}
      hasMore={hasMore}
      next={loadMore}
      loader={<div />}
    >
      <Card>
        {txnQueue.map(
          (txn, index) =>
            txn?.type === 'NEW_POST' && (
              <div key={txn.id}>
                <QueuedPublication txn={txn} index={index} />
              </div>
            )
        )}
        <Virtuoso
          useWindowScroll
          className="virtual-list"
          totalCount={publications?.length}
          components={{ Footer: () => <PublicationsShimmer inVirtualList /> }}
          itemContent={(index) => {
            const publication = publications?.[index] as FeedItem;
            return (
              <SinglePublication
                key={`${publication?.root.id}_${index}`}
                index={txnQueue.length > 0 ? -1 : index}
                feedItem={publication}
                publication={publication.root as LensterPublication}
              />
            );
          }}
        />
      </Card>
    </InfiniteScroll>
  );
};

export default Timeline;
