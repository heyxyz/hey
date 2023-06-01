import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import WalletProfile from '@components/Shared/WalletProfile';
import { UsersIcon } from '@heroicons/react/outline';
import type { FollowersRequest, Profile, Wallet } from '@lenster/lens';
import { useFollowersQuery } from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import { EmptyState, ErrorMessage } from '@lenster/ui';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useAppStore } from 'src/store/app';
import { FollowSource } from 'src/tracking';

interface FollowersProps {
  profile: Profile;
}

const Followers: FC<FollowersProps> = ({ profile }) => {
  const [hasMore, setHasMore] = useState(true);
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Variables
  const request: FollowersRequest = { profileId: profile?.id, limit: 30 };

  const { data, loading, error, fetchMore } = useFollowersQuery({
    variables: { request },
    skip: !profile?.id
  });

  const followers = data?.followers?.items;
  const pageInfo = data?.followers?.pageInfo;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    }).then(({ data }) => {
      setHasMore(data?.followers?.items?.length > 0);
    });
  };

  if (loading) {
    return <Loader message={t`Loading followers`} />;
  }

  if (followers?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">
              @{formatHandle(profile?.handle)}
            </span>
            <span>
              <Trans>doesn’t have any followers yet.</Trans>
            </span>
          </div>
        }
        icon={<UsersIcon className="text-brand h-8 w-8" />}
        hideCard
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto" data-testid="followers-modal">
      <ErrorMessage
        className="m-5"
        title={t`Failed to load followers`}
        error={error}
      />
      <Virtuoso
        className="virtual-profile-list"
        data={followers}
        endReached={onEndReached}
        itemContent={(index, follower) => {
          return (
            <div className="p-5">
              {follower?.wallet?.defaultProfile ? (
                <UserProfile
                  profile={follower?.wallet?.defaultProfile as Profile}
                  isFollowing={follower?.wallet?.defaultProfile?.isFollowedByMe}
                  followPosition={index + 1}
                  followSource={FollowSource.FOLLOWERS_MODAL}
                  showBio
                  showFollow={
                    currentProfile?.id !== follower?.wallet?.defaultProfile?.id
                  }
                  showUserPreview={false}
                />
              ) : (
                <WalletProfile wallet={follower?.wallet as Wallet} />
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default Followers;
