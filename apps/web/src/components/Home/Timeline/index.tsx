import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import type { AnyPublication, FeedItem, FeedRequest } from '@hey/lens';
import { FeedEventItemType, useFeedQuery } from '@hey/lens';
import { OptmisticPublicationType } from '@hey/types/enums';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import { type FC, useRef } from 'react';
import { type StateSnapshot, Virtuoso } from 'react-virtuoso';
import { useAppStore } from 'src/store/useAppStore';
import { useImpressionsStore } from 'src/store/useImpressionsStore';
import { useTimelinePersistStore } from 'src/store/useTimelinePersistStore';
import { useTimelineStore } from 'src/store/useTimelineStore';
import { useTransactionPersistStore } from 'src/store/useTransactionPersistStore';

let virtuosoState: any = { ranges: [], screenTop: 0 };

const Timeline: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const feedEventFilters = useTimelinePersistStore(
    (state) => state.feedEventFilters
  );
  const seeThroughProfile = useTimelineStore(
    (state) => state.seeThroughProfile
  );
  const fetchAndStoreViews = useImpressionsStore(
    (state) => state.fetchAndStoreViews
  );

  const virtuosoRef = useRef<any>();

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
      for: seeThroughProfile?.id ?? currentProfile?.id,
      feedEventItemTypes: getFeedEventItems()
    }
  };

  const { data, loading, error, fetchMore } = useFeedQuery({
    variables: { request },
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
    }
  });

  const publications = data?.feed?.items;
  const pageInfo = data?.feed?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
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
        icon={<UserGroupIcon className="text-brand-500 h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load timeline" error={error} />;
  }

  return (
    <>
      {txnQueue.map((txn) =>
        txn?.type !== OptmisticPublicationType.NewComment ? (
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
            isScrolling={(scrolling) => onScrolling(scrolling)}
            data={publications}
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
                    key={`${publication.root.__typename}_${index}`}
                    isFirst={index === 0}
                    isLast={index === publications.length - 1}
                    feedItem={publication as FeedItem}
                    publication={publication.root as AnyPublication}
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

export default Timeline;
