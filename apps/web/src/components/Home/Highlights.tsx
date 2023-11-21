import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import type { AnyPublication, FeedHighlightsRequest } from '@hey/lens';
import { LimitType, useFeedHighlightsQuery } from '@hey/lens';
import { OptmisticPublicationType } from '@hey/types/enums';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import { type FC, useRef } from 'react';
import type { StateSnapshot } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';
import { useImpressionsStore } from 'src/store/non-persisted/useImpressionsStore';
import { useTimelineStore } from 'src/store/non-persisted/useTimelineStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';

let virtuosoState: any = { ranges: [], screenTop: 0 };

const Highlights: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const txnQueue = useTransactionStore((state) => state.txnQueue);
  const seeThroughProfile = useTimelineStore(
    (state) => state.seeThroughProfile
  );
  const fetchAndStoreViews = useImpressionsStore(
    (state) => state.fetchAndStoreViews
  );

  const virtuosoRef = useRef<any>();

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

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    const { data } = await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
    const ids = data?.feedHighlights?.items?.map((p) => p.id) || [];
    await fetchAndStoreViews(ids);
  };

  const onScrolling = (scrolling: boolean) => {
    virtuosoRef?.current?.getState((state: StateSnapshot) => {
      if (!scrolling) {
        virtuosoState = { ...state };
      }
    });
  };

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
        {publications?.length ? (
          <Virtuoso
            useWindowScroll
            restoreStateFrom={
              virtuosoState.ranges.length === 0
                ? virtuosoRef?.current?.getState(
                    (state: StateSnapshot) => state
                  )
                : virtuosoState
            }
            ref={virtuosoRef}
            data={publications}
            isScrolling={onScrolling}
            endReached={onEndReached}
            className="virtual-feed-list"
            itemContent={(index, publication) => {
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SinglePublication
                    key={`${publication?.id}_${index}`}
                    isFirst={index === 0}
                    isLast={index === publications.length - 1}
                    publication={publication as AnyPublication}
                  />
                </motion.div>
              );
            }}
          />
        ) : null}
      </Card>
    </>
  );
};

export default Highlights;
