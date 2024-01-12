import type { AnyPublication, FeedHighlightsRequest } from '@hey/lens';
import type { FC } from 'react';

import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import { LimitType, useFeedHighlightsQuery } from '@hey/lens';
import { OptmisticPublicationType } from '@hey/types/enums';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { useInView } from 'react-cool-inview';
import { useImpressionsStore } from 'src/store/non-persisted/useImpressionsStore';
import { useTimelineStore } from 'src/store/non-persisted/useTimelineStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';

const Highlights: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const txnQueue = useTransactionStore((state) => state.txnQueue);
  const seeThroughProfile = useTimelineStore(
    (state) => state.seeThroughProfile
  );
  const fetchAndStoreViews = useImpressionsStore(
    (state) => state.fetchAndStoreViews
  );

  // Variables
  const request: FeedHighlightsRequest = {
    limit: LimitType.TwentyFive,
    where: { for: seeThroughProfile?.id || currentProfile?.id }
  };

  const { data, error, fetchMore, loading } = useFeedHighlightsQuery({
    onCompleted: async ({ feedHighlights }) => {
      const ids = feedHighlights?.items?.map((p) => p.id) || [];
      await fetchAndStoreViews(ids);
    },
    variables: { request }
  });

  const publications = data?.feedHighlights?.items;
  const pageInfo = data?.feedHighlights?.pageInfo;
  const hasMore = pageInfo?.next;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      const { data } = await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
      const ids = data?.feedHighlights?.items?.map((p) => p.id) || [];
      await fetchAndStoreViews(ids);
    }
  });

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        icon={<LightBulbIcon className="text-brand-500 size-8" />}
        message="No posts yet!"
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load highlights" />;
  }

  return (
    <>
      {txnQueue.map((txn) =>
        txn?.type === OptmisticPublicationType.NewPost ? (
          <QueuedPublication key={txn.id} txn={txn} />
        ) : null
      )}
      <Card className="divide-y-[1px] dark:divide-gray-700">
        {publications?.map((publication, index) => (
          <SinglePublication
            isFirst={index === 0}
            isLast={index === publications.length - 1}
            key={`${publication?.id}_${index}`}
            publication={publication as AnyPublication}
          />
        ))}
        {hasMore ? <span ref={observe} /> : null}
      </Card>
    </>
  );
};

export default Highlights;
