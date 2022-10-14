import { useLazyQuery } from '@apollo/client';
import QueuedPublication from '@components/Publication/QueuedPublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import type { FeedItem } from '@generated/types';
import { FeedEventItemType } from '@generated/types';
import { TimelineDocument } from '@generated/types';
import { CollectionIcon } from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useInView } from 'react-cool-inview';
import { PAGINATION_ROOT_MARGIN } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { useTimelinePersistStore } from 'src/store/timeline';
import { useTransactionPersistStore } from 'src/store/transaction';
import { PAGINATION } from 'src/tracking';

import SinglePublication from './Publication/SinglePublication';

const Timeline: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const feedEventFilters = useTimelinePersistStore((state) => state.feedEventFilters);

  const getFeedEventItems = () => {
    const filters: FeedEventItemType[] = [];
    if (feedEventFilters.posts) {
      filters.push(...[FeedEventItemType.Post, FeedEventItemType.Comment]);
    }
    if (feedEventFilters.collects) {
      filters.push(...[FeedEventItemType.CollectPost, FeedEventItemType.CollectComment]);
    }
    if (feedEventFilters.mirrors) {
      filters.push(FeedEventItemType.Mirror);
    }
    if (feedEventFilters.reactions) {
      filters.push(...[FeedEventItemType.ReactionPost, FeedEventItemType.ReactionPost]);
    }
    return filters;
  };

  // Variables
  const request = { profileId: currentProfile?.id, limit: 50, feedEventItemTypes: getFeedEventItems() };
  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;

  const [fetchTimeline, { data, loading, error, fetchMore }] = useLazyQuery(TimelineDocument, {
    variables: {
      request,
      reactionRequest,
      profileId
    }
  });

  useEffect(() => {
    fetchTimeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedEventFilters]);

  const publications = data?.feed?.items;
  const pageInfo = data?.feed?.pageInfo;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
      });
      Leafwatch.track(PAGINATION.HOME_FEED);
    },
    rootMargin: PAGINATION_ROOT_MARGIN
  });

  if (loading) {
    return <PublicationsShimmer />;
  }

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
    <>
      <Card className="divide-y-[1px] dark:divide-gray-700/80">
        {txnQueue.map(
          (txn) =>
            txn?.type === 'NEW_POST' && (
              <div key={txn.id}>
                <QueuedPublication txn={txn} />
              </div>
            )
        )}
        {publications?.map((publication, index: number) => (
          <SinglePublication key={`${publication?.root.id}_${index}`} feedItem={publication as FeedItem} />
        ))}
      </Card>
      {pageInfo?.next && publications?.length !== pageInfo.totalCount && (
        <span ref={observe} className="flex justify-center p-5">
          <Spinner size="sm" />
        </span>
      )}
    </>
  );
};

export default Timeline;
