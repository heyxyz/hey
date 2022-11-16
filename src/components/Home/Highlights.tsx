import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import type { LensterPublication } from '@generated/lenstertypes';
import { useFeedHighlightsQuery } from '@generated/types';
import { CollectionIcon } from '@heroicons/react/outline';
import type { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Virtuoso } from 'react-virtuoso';
import { SCROLL_THRESHOLD } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { useTransactionPersistStore } from 'src/store/transaction';

const Highlights: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);

  // Variables
  const request = { profileId: currentProfile?.id, limit: 10 };
  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } = useFeedHighlightsQuery({
    variables: { request, reactionRequest, profileId }
  });

  const publications = data?.feedHighlights?.items;
  const pageInfo = data?.feedHighlights?.pageInfo;
  const hasMore = pageInfo?.next && publications?.length !== pageInfo.totalCount;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
    });
  };

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        message={<div>No posts yet!</div>}
        icon={<CollectionIcon className="w-8 h-8 text-brand" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load highlights" error={error} />;
  }

  return (
    <InfiniteScroll
      dataLength={publications?.length ?? 0}
      scrollThreshold={SCROLL_THRESHOLD}
      hasMore={hasMore}
      next={loadMore}
      loader={<div />}
    >
      <Card>
        {txnQueue.map(
          (txn) =>
            txn?.type === 'NEW_POST' && (
              <div key={txn.id}>
                <QueuedPublication txn={txn} />
              </div>
            )
        )}
        <Virtuoso
          useWindowScroll
          className="virtual-list"
          totalCount={publications?.length}
          components={{ Footer: () => <PublicationsShimmer inVirtualList /> }}
          itemContent={(index) => {
            const publication = publications?.[index] as LensterPublication;
            return (
              <SinglePublication
                key={`${publication?.id}_${index}`}
                index={index}
                publication={publication}
              />
            );
          }}
        />
      </Card>
    </InfiniteScroll>
  );
};

export default Highlights;
