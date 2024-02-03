import type { AnyPublication, FeedItem, FeedRequest } from '@hey/lens';
import type { FC } from 'react';

import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { HEY_CURATED_ID } from '@hey/data/constants';
import { FeedEventItemType, useFeedQuery } from '@hey/lens';
import { OptmisticPublicationType } from '@hey/types/enums';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { memo } from 'react';
import { useInView } from 'react-cool-inview';
import { useImpressionsStore } from 'src/store/non-persisted/useImpressionsStore';
import { useTimelineStore } from 'src/store/non-persisted/useTimelineStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';

const Timeline: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const txnQueue = useTransactionStore((state) => state.txnQueue);
  const seeThroughProfile = useTimelineStore(
    (state) => state.seeThroughProfile
  );
  const fallbackToCuratedFeed = useProfileStore(
    (state) => state.fallbackToCuratedFeed
  );
  const fetchAndStoreViews = useImpressionsStore(
    (state) => state.fetchAndStoreViews
  );

  // Variables
  const request: FeedRequest = {
    where: {
      feedEventItemTypes: [
        FeedEventItemType.Acted,
        FeedEventItemType.Collect,
        FeedEventItemType.Mirror,
        FeedEventItemType.Post,
        FeedEventItemType.Quote,
        FeedEventItemType.Reaction
      ],
      for: fallbackToCuratedFeed
        ? HEY_CURATED_ID
        : seeThroughProfile?.id || currentProfile?.id
    }
  };

  const { data, error, fetchMore, loading } = useFeedQuery({
    onCompleted: async ({ feed }) => {
      const ids =
        feed?.items?.flatMap((p) => {
          return [p.root.id].filter((id) => id);
        }) || [];
      await fetchAndStoreViews(ids);
    },
    variables: { request }
  });

  const feed = data?.feed?.items.filter(
    (item) => item.root.__typename !== 'Comment'
  );
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
          return [p.root.id].filter((id) => id);
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
