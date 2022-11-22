import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import InfiniteLoader from '@components/UI/InfiniteLoader';
import type { LensterPublication } from '@generated/types';
import { CollectionIcon } from '@heroicons/react/outline';
import { SCROLL_THRESHOLD } from 'data/constants';
import { CustomFiltersTypes, useCommentFeedQuery } from 'lens';
import type { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppStore } from 'src/store/app';
import { useTransactionPersistStore } from 'src/store/transaction';

import NewPublication from '../Composer/NewPublication';
import CommentWarning from '../Shared/CommentWarning';

interface Props {
  publication?: LensterPublication;
}

const Feed: FC<Props> = ({ publication }) => {
  const publicationId = publication?.__typename === 'Mirror' ? publication?.mirrorOf?.id : publication?.id;
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);

  // Variables
  const request = { commentsOf: publicationId, customFilters: [CustomFiltersTypes.Gardeners], limit: 10 };
  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } = useCommentFeedQuery({
    variables: { request, reactionRequest, profileId },
    skip: !publicationId
  });

  const comments = data?.publications?.items ?? [];
  const pageInfo = data?.publications?.pageInfo;
  const hasMore = pageInfo?.next && comments?.length !== pageInfo.totalCount;

  const queuedCount = txnQueue.filter((o) => o.type === 'NEW_COMMENT').length;
  const totalComments = comments?.length + queuedCount;
  const canComment = publication?.canComment?.result;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
    });
  };

  return (
    <>
      {currentProfile ? canComment ? <NewPublication publication={publication} /> : <CommentWarning /> : null}
      {loading && <PublicationsShimmer />}
      {!loading && totalComments === 0 && (
        <EmptyState
          message={<span>Be the first one to comment!</span>}
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
        />
      )}
      <ErrorMessage title="Failed to load comment feed" error={error} />
      {!error && !loading && totalComments !== 0 && (
        <InfiniteScroll
          dataLength={totalComments}
          scrollThreshold={SCROLL_THRESHOLD}
          hasMore={hasMore}
          next={loadMore}
          loader={<InfiniteLoader />}
        >
          <Card className="divide-y-[1px] dark:divide-gray-700/80">
            {txnQueue.map(
              (txn) =>
                txn?.type === 'NEW_COMMENT' &&
                txn?.parent === publication?.id && (
                  <div key={txn.id}>
                    <QueuedPublication txn={txn} />
                  </div>
                )
            )}
            {comments?.map((comment, index: number) => (
              <SinglePublication
                key={`${publicationId}_${index}`}
                publication={comment as LensterPublication}
                showType={false}
              />
            ))}
          </Card>
        </InfiniteScroll>
      )}
    </>
  );
};

export default Feed;
