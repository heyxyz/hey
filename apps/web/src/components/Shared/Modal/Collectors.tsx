import UserProfile from '@components/Shared/UserProfile';
import WalletProfile from '@components/Shared/WalletProfile';
import { CollectionIcon } from '@heroicons/react/outline';
import type {
  Profile,
  Wallet,
  WhoCollectedPublicationRequest
} from '@lenster/lens';
import { useCollectorsQuery } from '@lenster/lens';
import { EmptyState, ErrorMessage } from '@lenster/ui';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { FollowUnfollowSource } from 'src/tracking';

import Loader from '../Loader';

interface CollectorsProps {
  publicationId: string;
}

const Collectors: FC<CollectorsProps> = ({ publicationId }) => {
  const [hasMore, setHasMore] = useState(true);

  // Variables
  const request: WhoCollectedPublicationRequest = {
    publicationId: publicationId,
    limit: 10
  };

  const { data, loading, error, fetchMore } = useCollectorsQuery({
    variables: { request },
    skip: !publicationId
  });

  const profiles = data?.whoCollectedPublication?.items;
  const pageInfo = data?.whoCollectedPublication?.pageInfo;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    }).then(({ data }) => {
      setHasMore(data?.whoCollectedPublication?.items?.length > 0);
    });
  };

  if (loading) {
    return <Loader message={t`Loading collectors`} />;
  }

  if (profiles?.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          message={t`No collectors.`}
          icon={<CollectionIcon className="text-brand h-8 w-8" />}
          hideCard
        />
      </div>
    );
  }

  return (
    <div
      className="max-h-[80vh] overflow-y-auto"
      data-testid="collectors-modal"
    >
      <ErrorMessage
        className="m-5"
        title={t`Failed to load collectors`}
        error={error}
      />
      <Virtuoso
        className="virtual-profile-list"
        data={profiles}
        endReached={onEndReached}
        itemContent={(index, wallet) => {
          return (
            <div className="p-5">
              {wallet?.defaultProfile ? (
                <UserProfile
                  profile={wallet?.defaultProfile as Profile}
                  isFollowing={wallet?.defaultProfile?.isFollowedByMe}
                  followUnfollowPosition={index + 1}
                  followUnfollowSource={FollowUnfollowSource.COLLECTORS_MODAL}
                  showBio
                  showFollow
                  showUserPreview={false}
                />
              ) : (
                <WalletProfile wallet={wallet as Wallet} />
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default Collectors;
