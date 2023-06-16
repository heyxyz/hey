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
import { t } from '@lingui/macro';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';
import { OptmisticPublicationType } from 'src/enums';
import { useAppStore } from 'src/store/app';
import { useTransactionPersistStore } from 'src/store/transaction';

import NewPublication from '../Composer/NewPublication';
import CommentWarning from '../Shared/CommentWarning';

interface FeedProps {
  publication?: Publication;
}

const Feed: FC<FeedProps> = ({ publication }) => {
  const publicationId =
    publication?.__typename === 'Mirror'
      ? publication?.mirrorOf?.id
      : publication?.id;
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const [hasMore, setHasMore] = useState(true);

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

  const queuedCount = txnQueue.filter(
    (o) => o.type === OptmisticPublicationType.NewComment
  ).length;
  const hiddenCount = comments.filter(
    (o) => o?.__typename === 'Comment' && o.hidden
  ).length;
  const hiddenRemovedComments = comments?.length - hiddenCount;
  const totalComments = hiddenRemovedComments + queuedCount;
  const canComment = publication?.canComment?.result;

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
      }).then(({ data }) => {
        setHasMore(data?.publications?.items?.length > 0);
      });
    }
  });

  const Wrapper = ({ children }: { children: ReactNode }) => {
    return (
      <>
        {currentProfile && !publication?.hidden ? (
          canComment ? (
            <NewPublication publication={publication} />
          ) : (
            <CommentWarning />
          )
        ) : null}
        {children}
      </>
    );
  };

  if (loading) {
    return (
      <Wrapper>
        <PublicationsShimmer />
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <ErrorMessage title={t`Failed to load comment feed`} error={error} />
      </Wrapper>
    );
  }

  if (!publication?.hidden && totalComments === 0) {
    return (
      <Wrapper>
        <EmptyState
          message={t`Be the first one to comment!`}
          icon={<ChatAlt2Icon className="text-brand h-8 w-8" />}
        />
      </Wrapper>
    );
  }

  return (
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
      {comments?.map((comment, index) =>
        comment?.__typename === 'Comment' && comment.hidden ? null : (
          <SinglePublication
            key={`${publicationId}_${index}`}
            isFirst={index === 0}
            isLast={index === comments.length - 1}
            publication={comment as Comment}
            showType={false}
          />
        )
      )}
      {hasMore && <span ref={observe} />}
    </Card>
  );
};

export default Feed;
