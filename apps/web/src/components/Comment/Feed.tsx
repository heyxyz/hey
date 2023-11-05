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
import getPublicationViewCountById from '@hey/lib/getPublicationViewCountById';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { OptmisticPublicationType } from '@hey/types/enums';
import type { PublicationViewCount } from '@hey/types/hey';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import getPublicationsViews from '@lib/getPublicationsViews';
import { type FC, useState } from 'react';
import { useInView } from 'react-cool-inview';
import { useTransactionPersistStore } from 'src/store/useTransactionPersistStore';

interface FeedProps {
  publication: AnyPublication;
}

const Feed: FC<FeedProps> = ({ publication }) => {
  const publicationId = isMirrorPublication(publication)
    ? publication?.mirrorOn?.id
    : publication?.id;
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const [views, setViews] = useState<PublicationViewCount[] | []>([]);

  const fetchAndStoreViews = async (ids: string[]) => {
    if (ids.length) {
      const viewsResponse = await getPublicationsViews(ids);
      setViews((prev) => [...prev, ...viewsResponse]);
    }
  };

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
        {comments?.map((comment, index) =>
          comment?.__typename !== 'Comment' || comment.isHidden ? null : (
            <SinglePublication
              key={`${comment.id}`}
              isFirst={index === 0}
              isLast={index === comments.length - 1}
              publication={comment as Comment}
              views={getPublicationViewCountById(views, comment as Comment)}
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
