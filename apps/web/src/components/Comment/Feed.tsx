import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import type { AnyPublication, Comment, PublicationsRequest } from '@hey/lens';
import {
  CommentRankingFilterType,
  CustomFiltersType,
  LimitType,
  usePublicationsQuery
} from '@hey/lens';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { OptmisticPublicationType } from '@hey/types/enums';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import { type FC, useRef } from 'react';
import type { StateSnapshot } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';
import { useImpressionsStore } from 'src/store/useImpressionsStore';
import { useTransactionPersistStore } from 'src/store/useTransactionPersistStore';

let virtuosoState: any = { ranges: [], screenTop: 0 };

interface FeedProps {
  publication: AnyPublication;
}

const Feed: FC<FeedProps> = ({ publication }) => {
  const publicationId = isMirrorPublication(publication)
    ? publication?.mirrorOn?.id
    : publication?.id;
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const fetchAndStoreViews = useImpressionsStore(
    (state) => state.fetchAndStoreViews
  );

  const virtuosoRef = useRef<any>();

  // Variables
  const request: PublicationsRequest = {
    where: {
      commentOn: {
        id: publicationId,
        ranking: { filter: CommentRankingFilterType.Relevant }
      },
      customFilters: [CustomFiltersType.Gardeners]
    },
    limit: LimitType.TwentyFive
  };

  const { data, loading, error, fetchMore } = usePublicationsQuery({
    variables: { request },
    skip: !publicationId,
    onCompleted: async ({ publications }) => {
      const ids = publications?.items?.map((p) => p.id) || [];
      await fetchAndStoreViews(ids);
    }
  });

  const comments = data?.publications?.items ?? [];
  const pageInfo = data?.publications?.pageInfo;
  const hasMore = pageInfo?.next;

  const queuedComments = txnQueue.filter(
    (o) =>
      o.type === OptmisticPublicationType.NewComment &&
      o.commentOn === publicationId
  );
  const queuedCount = queuedComments.length;
  const hiddenCount = comments.filter(
    (o) => o?.__typename === 'Comment' && o.isHidden
  ).length;
  const hiddenRemovedComments = comments?.length - hiddenCount;
  const totalComments = hiddenRemovedComments + queuedCount;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    const { data } = await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
    const ids = data?.publications?.items?.map((p) => p.id) || [];
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

  if (error) {
    return <ErrorMessage title="Failed to load comment feed" error={error} />;
  }

  if (!publication?.isHidden && totalComments === 0) {
    return (
      <EmptyState
        message="Be the first one to comment!"
        icon={<ChatBubbleLeftRightIcon className="text-brand-500 h-8 w-8" />}
      />
    );
  }

  return (
    <>
      {queuedComments.map((txn) => (
        <QueuedPublication key={txn.id} txn={txn} />
      ))}
      <Card className="divide-y-[1px] dark:divide-gray-700">
        {comments?.length ? (
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
            data={comments.filter(
              (comment) =>
                comment?.__typename === 'Comment' && !comment.isHidden
            )}
            endReached={onEndReached}
            className="virtual-feed-list"
            itemContent={(index, comment) => {
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SinglePublication
                    key={`${comment.id}`}
                    isFirst={index === 0}
                    isLast={index === comments.length - 1}
                    publication={comment as Comment}
                    showType={false}
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

export default Feed;
