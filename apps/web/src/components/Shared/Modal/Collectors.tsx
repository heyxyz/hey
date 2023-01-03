import UserProfile from '@components/Shared/UserProfile';
import WalletProfile from '@components/Shared/WalletProfile';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import InfiniteLoader from '@components/UI/InfiniteLoader';
import { CollectionIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import { SCROLL_THRESHOLD } from 'data/constants';
import type { Profile, Wallet } from 'lens';
import { useCollectorsQuery } from 'lens';
import type { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Loader from '../Loader';

interface Props {
  publicationId: string;
}

const Collectors: FC<Props> = ({ publicationId }) => {
  // Variables
  const request = { publicationId: publicationId, limit: 10 };

  const { data, loading, error, fetchMore } = useCollectorsQuery({
    variables: { request },
    skip: !publicationId
  });

  const profiles = data?.whoCollectedPublication?.items;
  const pageInfo = data?.whoCollectedPublication?.pageInfo;
  const hasMore = pageInfo?.next && profiles?.length !== pageInfo.totalCount;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  if (loading) {
    return <Loader message="Loading collectors" />;
  }

  if (profiles?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          message={t`No collectors.`}
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
          hideCard
        />
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[80vh]" id="scrollableDiv">
      <ErrorMessage className="m-5" title={t`Failed to load collectors`} error={error} />
      <InfiniteScroll
        dataLength={profiles?.length ?? 0}
        scrollThreshold={SCROLL_THRESHOLD}
        hasMore={hasMore}
        next={loadMore}
        loader={<InfiniteLoader />}
        scrollableTarget="scrollableDiv"
      >
        <div className="divide-y dark:divide-gray-700">
          {profiles?.map((wallet) => (
            <div className="p-5" key={wallet?.address}>
              {wallet?.defaultProfile ? (
                <UserProfile
                  profile={wallet?.defaultProfile as Profile}
                  showBio
                  showFollow
                  isFollowing={wallet?.defaultProfile?.isFollowedByMe}
                />
              ) : (
                <WalletProfile wallet={wallet as Wallet} />
              )}
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Collectors;
