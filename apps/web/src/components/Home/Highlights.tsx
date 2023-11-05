import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import type { AnyPublication, FeedHighlightsRequest } from '@hey/lens';
import { LimitType, useFeedHighlightsQuery } from '@hey/lens';
import { OptmisticPublicationType } from '@hey/types/enums';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { type FC } from 'react';
import { useInView } from 'react-cool-inview';
import { useAppStore } from 'src/store/useAppStore';
import { useImpressionsStore } from 'src/store/useImpressionsStore';
import { useTimelineStore } from 'src/store/useTimelineStore';
import { useTransactionPersistStore } from 'src/store/useTransactionPersistStore';

const Highlights: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const seeThroughProfile = useTimelineStore(
    (state) => state.seeThroughProfile
  );
  const publicationViews = useImpressionsStore(
    (state) => state.publicationViews
  );
  const fetchAndStoreViews = useImpressionsStore(
    (state) => state.fetchAndStoreViews
  );

  // Variables
  const request: FeedHighlightsRequest = {
    where: { for: seeThroughProfile?.id ?? currentProfile?.id },
    limit: LimitType.TwentyFive
  };

  const { data, loading, error, fetchMore } = useFeedHighlightsQuery({
    variables: { request },
    onCompleted: async ({ feedHighlights }) => {
      const ids = feedHighlights?.items?.map((p) => p.id) || [];
      await fetchAndStoreViews(ids);
    }
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
        message="No posts yet!"
        icon={<LightBulbIcon className="text-brand-500 h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load highlights" error={error} />;
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
            key={`${publication?.id}_${index}`}
            isFirst={index === 0}
            isLast={index === publications.length - 1}
            publication={publication as AnyPublication}
          />
        ))}
        {hasMore ? <span ref={observe} /> : null}
      </Card>
    </>
  );
};

export default Highlights;
