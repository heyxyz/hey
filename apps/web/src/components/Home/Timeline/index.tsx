import type { AnyPublication, FeedItem, FeedRequest } from '@hey/lens';
import type { FC } from 'react';

import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { FeedEventItemType, useFeedQuery } from '@hey/lens';
import { OptmisticPublicationType } from '@hey/types/enums';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { memo } from 'react';
import { useInView } from 'react-cool-inview';
import { useImpressionsStore } from 'src/store/non-persisted/useImpressionsStore';
import { useTimelineStore } from 'src/store/non-persisted/useTimelineStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useTimelineFilterStore } from 'src/store/persisted/useTimelineFilterStore';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';

const Timeline: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const txnQueue = useTransactionStore((state) => state.txnQueue);
  const feedEventFilters = useTimelineFilterStore(
    (state) => state.feedEventFilters
  );
  const seeThroughProfile = useTimelineStore(
    (state) => state.seeThroughProfile
  );
  const fetchAndStoreViews = useImpressionsStore(
    (state) => state.fetchAndStoreViews
  );

  const getFeedEventItems = () => {
    const filters: FeedEventItemType[] = [];
    if (feedEventFilters.posts) {
      filters.push(FeedEventItemType.Post, FeedEventItemType.Comment);
    }
    if (feedEventFilters.collects) {
      filters.push(FeedEventItemType.Collect, FeedEventItemType.Comment);
    }
    if (feedEventFilters.mirrors) {
      filters.push(FeedEventItemType.Mirror);
    }
    if (feedEventFilters.likes) {
      filters.push(FeedEventItemType.Reaction, FeedEventItemType.Comment);
    }
    return filters;
  };

  // Variables
  const request: FeedRequest = {
    where: {
      feedEventItemTypes: getFeedEventItems(),
      for: seeThroughProfile?.id || currentProfile?.id
    }
  };

  const { data, error, fetchMore, loading } = useFeedQuery({
    onCompleted: async ({ feed }) => {
      const ids =
        feed?.items?.flatMap((p) => {
          return [
            p.root.id,
            p.comments?.[0]?.id,
            p.root.__typename === 'Comment' && p.root.commentOn?.id
          ].filter((id) => id);
        }) || [];
      await fetchAndStoreViews(ids);
    },
    variables: { request }
  });

  const feed = data?.feed?.items;
  const pageInfo = data?.feed?.pageInfo;
  const hasMore = pageInfo?.next;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      const { data } = await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
      const ids =
        data.feed?.items?.flatMap((p) => {
          return [
            p.root.id,
            p.comments?.[0]?.id,
            p.root.__typename === 'Comment' && p.root.commentOn?.id
          ].filter((id) => id);
        }) || [];
      await fetchAndStoreViews(ids);
    }
  });

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (feed?.length === 0) {
    return (
      <EmptyState
        icon={<UserGroupIcon className="text-brand-500 size-8" />}
        message="No posts yet!"
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load timeline" />;
  }

  return (
    <>
      {txnQueue.map((txn) =>
        txn?.type !== OptmisticPublicationType.NewComment ? (
          <QueuedPublication key={txn.id} txn={txn} />
        ) : null
      )}
      <Card className="divide-y-[1px] dark:divide-gray-700">
        {feed?.map((feedItem, index) => (
          <SinglePublication
            feedItem={feedItem as FeedItem}
            isFirst={index === 0}
            isLast={index === feed.length - 1}
            key={feedItem.id}
            publication={feedItem.root as AnyPublication}
          />
        ))}
        {hasMore ? <span ref={observe} /> : null}
      </Card>
    </>
  );
};

export default memo(Timeline);
