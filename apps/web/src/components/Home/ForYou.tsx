import type { AnyPublication, PublicationForYouRequest } from '@good/lens';
import type { FC } from 'react';

import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { LimitType, useForYouQuery } from '@good/lens';
import { OptmisticPublicationType } from '@good/types/enums';
import { Card, EmptyState, ErrorMessage } from '@good/ui';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import { Virtuoso } from 'react-virtuoso';
import { useImpressionsStore } from 'src/store/non-persisted/useImpressionsStore';
import { useTipsStore } from 'src/store/non-persisted/useTipsStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';

const ForYou: FC = () => {
  const { currentProfile } = useProfileStore();
  const { txnQueue } = useTransactionStore();
  const { fetchAndStoreViews } = useImpressionsStore();
  const { fetchAndStoreTips } = useTipsStore();

  // Variables
  const request: PublicationForYouRequest = {
    for: currentProfile?.id,
    limit: LimitType.TwentyFive
  };

  const { data, error, fetchMore, loading } = useForYouQuery({
    onCompleted: async ({ forYou }) => {
      const ids = forYou?.items?.map((p) => p.publication.id) || [];
      await fetchAndStoreViews(ids);
      await fetchAndStoreTips(ids);
    },
    variables: { request }
  });

  const publications = data?.forYou?.items;
  const pageInfo = data?.forYou?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    const { data } = await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
    const ids = data?.forYou?.items?.map((p) => p.publication.id) || [];
    await fetchAndStoreViews(ids);
    await fetchAndStoreTips(ids);
  };

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        icon={<LightBulbIcon className="size-8" />}
        message="No posts yet!"
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load highlights" />;
  }

  return (
    <>
      {txnQueue.map((txn) =>
        txn?.type === OptmisticPublicationType.Post ? (
          <QueuedPublication key={txn.txId} txn={txn} />
        ) : null
      )}
      <Card>
        <Virtuoso
          className="virtual-divider-list-window"
          computeItemKey={(index, item) => `${item.publication.id}-${index}`}
          data={publications}
          endReached={onEndReached}
          itemContent={(index, item) => {
            return (
              <SinglePublication
                isFirst={index === 0}
                isLast={index === (publications?.length || 0) - 1}
                publication={item.publication as AnyPublication}
              />
            );
          }}
          useWindowScroll
        />
      </Card>
    </>
  );
};

export default ForYou;
