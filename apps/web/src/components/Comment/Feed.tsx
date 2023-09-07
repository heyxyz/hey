import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { ChatAlt2Icon } from '@heroicons/react/outline';
import type {
  Comment,
  Publication,
  PublicationsQueryRequest
} from '@lenster/lens';
import {
  CommentOrderingTypes,
  CommentRankingFilter,
  CustomFiltersTypes,
  useCommentFeedQuery
} from '@lenster/lens';
import { Card, EmptyState, ErrorMessage } from '@lenster/ui';
import { t, Trans } from '@lingui/macro';
import { type FC, useState } from 'react';
import { useInView } from 'react-cool-inview';
import { OptmisticPublicationType } from 'src/enums';
import { useAppStore } from 'src/store/app';
import { useTransactionPersistStore } from 'src/store/transaction';

interface FeedProps {
  publication?: Publication;
}

const Feed: FC<FeedProps> = ({ publication }) => {
  const [orderByRecent, setOrderByRecent] = useState(false);
  const publicationId =
    publication?.__typename === 'Mirror'
      ? publication?.mirrorOf?.id
      : publication?.id;
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);

  // Variables
  const request: PublicationsQueryRequest = {
    commentsOf: publicationId,
    customFilters: [CustomFiltersTypes.Gardeners],
    commentsOfOrdering: CommentOrderingTypes.Ranking,
    commentsRankingFilter: CommentRankingFilter.Relevant,
    limit: 30
  };
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } = useCommentFeedQuery({
    variables: { request, reactionRequest, profileId },
    skip: !publicationId
  });

  const comments = data?.publications?.items ?? [];
  const pageInfo = data?.publications?.pageInfo;
  const hasMore = pageInfo?.next;

  const queuedCount = txnQueue.filter(
    (o) => o.type === OptmisticPublicationType.NewComment
  ).length;
  const hiddenCount = comments.filter(
    (o) => o?.__typename === 'Comment' && o.hidden
  ).length;
  const hiddenRemovedComments = comments?.length - hiddenCount;
  const totalComments = hiddenRemovedComments + queuedCount;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      await fetchMore({
        variables: {
          request: { ...request, cursor: pageInfo?.next },
          reactionRequest,
          profileId
        }
      });
    }
  });

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (error) {
    return (
      <ErrorMessage title={t`Failed to load comment feed`} error={error} />
    );
  }

  if (!publication?.hidden && totalComments === 0) {
    return (
      <EmptyState
        message={t`Be the first one to comment!`}
        icon={<ChatAlt2Icon className="text-brand h-8 w-8" />}
      />
    );
  }

  let sortedComments = comments;

  if (orderByRecent && comments) {
    sortedComments = comments
      ?.filter(
        // @ts-ignore
        (comment) => comment?.__typename === 'Comment' || !comment.hidden
      )
      .sort((a, b) => {
        // @ts-ignore
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>Comments</div>
        <select
          className="focus:border-brand-500 focus:ring-brand-400 rounded-xl border border-gray-300 bg-white outline-none dark:border-gray-700 dark:bg-gray-800"
          onChange={(e) => {
            e.target.value === 'Most Recent'
              ? setOrderByRecent(true)
              : setOrderByRecent(false);
          }}
        >
          <option value={'Most Recent'} selected={orderByRecent}>
            <Trans>Most Recent</Trans>
          </option>
          <option value={'Relevant'} selected={!orderByRecent}>
            <Trans>Relevant</Trans>
          </option>
        </select>
      </div>
      <Card
        className="divide-y-[1px] dark:divide-gray-700"
        dataTestId="comments-feed"
      >
        {txnQueue.map(
          (txn) =>
            txn?.type === OptmisticPublicationType.NewComment &&
            txn?.parent === publication?.id && (
              <div key={txn.id}>
                <QueuedPublication txn={txn} />
              </div>
            )
        )}
        {sortedComments?.map((comment, index) =>
          comment?.__typename !== 'Comment' || comment.hidden ? null : (
            <SinglePublication
              key={`${comment.id}`}
              isFirst={index === 0}
              isLast={index === comments.length - 1}
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
