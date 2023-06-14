import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { CollectionIcon } from '@heroicons/react/outline';
import type { FeedHighlightsRequest, Publication } from '@lenster/lens';
import { useFeedHighlightsQuery } from '@lenster/lens';
import { Card, EmptyState, ErrorMessage } from '@lenster/ui';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { OptmisticPublicationType } from 'src/enums';
import { useAppStore } from 'src/store/app';
import { useTransactionPersistStore } from 'src/store/transaction';

const Highlights: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const [hasMore, setHasMore] = useState(true);

  // Variables
  const request: FeedHighlightsRequest = {
    profileId: currentProfile?.id,
    limit: 10
  };
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } = useFeedHighlightsQuery({
    variables: { request, reactionRequest, profileId }
  });

  const publications = data?.feedHighlights?.items ?? [];
  const pageInfo = data?.feedHighlights?.pageInfo;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    await fetchMore({
      variables: {
        request: { ...request, cursor: pageInfo?.next },
        reactionRequest,
        profileId
      }
    }).then(({ data }) => {
      setHasMore(data?.feedHighlights?.items?.length > 0);
    });
  };

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        message={t`No posts yet!`}
        icon={<CollectionIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title={t`Failed to load highlights`} error={error} />;
  }

  return (
    <Card className="divide-y-[1px] dark:divide-gray-700">
      {txnQueue.map(
        (txn) =>
          txn?.type === OptmisticPublicationType.NewPost && (
            <div key={txn.id}>
              <QueuedPublication txn={txn} />
            </div>
          )
      )}
      <Virtuoso
        useWindowScroll
        className="virtual-feed"
        data={publications}
        endReached={onEndReached}
        itemContent={(index, publication) => {
          return (
            <SinglePublication
              key={`${publication.id}_${index}`}
              isFirst={index === 0}
              isLast={index === publications.length - 1}
              publication={publication as Publication}
            />
          );
        }}
      />
    </Card>
  );
};

export default Highlights;
