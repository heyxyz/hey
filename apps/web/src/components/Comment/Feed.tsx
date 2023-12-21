import type { AnyPublication, Comment, PublicationsRequest } from '@hey/lens';
import type { FC } from 'react';

import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import {
  CommentRankingFilterType,
  CustomFiltersType,
  LimitType,
  usePublicationsQuery
} from '@hey/lens';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { OptmisticPublicationType } from '@hey/types/enums';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { useInView } from 'react-cool-inview';
import { useImpressionsStore } from 'src/store/non-persisted/useImpressionsStore';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';

interface FeedProps {
  publication: AnyPublication;
}

const Feed: FC<FeedProps> = ({ publication }) => {
  const publicationId = isMirrorPublication(publication)
    ? publication?.mirrorOn?.id
    : publication?.id;
  const txnQueue = useTransactionStore((state) => state.txnQueue);
  const fetchAndStoreViews = useImpressionsStore(
    (state) => state.fetchAndStoreViews
  );

  // Variables
  const request: PublicationsRequest = {
    limit: LimitType.TwentyFive,
    where: {
      commentOn: {
        id: publicationId,
        ranking: { filter: CommentRankingFilterType.Relevant }
      },
      customFilters: [CustomFiltersType.Gardeners]
    }
  };

  const { data, error, fetchMore, loading } = usePublicationsQuery({
    onCompleted: async ({ publications }) => {
      const ids = publications?.items?.map((p) => p.id) || [];
      await fetchAndStoreViews(ids);
    },
    skip: !publicationId,
    variables: { request }
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

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      const { data } = await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
      const ids = data?.publications?.items?.map((p) => p.id) || [];
      await fetchAndStoreViews(ids);
    }
  });

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load comment feed" />;
  }

  if (!publication?.isHidden && totalComments === 0) {
    return (
      <EmptyState
        icon={<ChatBubbleLeftRightIcon className="text-brand-500 size-8" />}
        message="Be the first one to comment!"
      />
    );
  }

  return (
    <>
      {queuedComments.map((txn) => (
        <QueuedPublication key={txn.id} txn={txn} />
      ))}
      <Card className="divide-y-[1px] dark:divide-gray-700">
        {comments?.map((comment, index) =>
          comment?.__typename !== 'Comment' || comment.isHidden ? null : (
            <SinglePublication
              isFirst={index === 0}
              isLast={index === comments.length - 1}
              key={`${comment.id}`}
              publication={comment as Comment}
              showType={false}
            />
          )
        )}
        {hasMore ? <span ref={observe} /> : null}
      </Card>
    </>
  );
};

export default Feed;
