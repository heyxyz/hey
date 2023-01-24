import { FollowSource } from '@components/Shared/Follow';
import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import WalletProfile from '@components/Shared/WalletProfile';
import { EmptyState } from '@components/UI/EmptyState';
import InfiniteLoader from '@components/UI/InfiniteLoader';
import { UsersIcon } from '@heroicons/react/outline';
import { useProfileFollowers } from '@lens-protocol/react';
import formatHandle from '@lib/formatHandle';
import { t, Trans } from '@lingui/macro';
import { SCROLL_THRESHOLD } from 'data/constants';
import type { Profile, Wallet } from 'lens';
import type { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
  profile: Profile;
}

const Followers: FC<Props> = ({ profile }) => {
  const {
    data: followers,
    loading,
    hasMore,
    next
  } = useProfileFollowers({ profileId: profile?.id, limit: 10 });

  if (loading) {
    return <Loader message={t`Loading followers`} />;
  }

  if (followers?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">@{formatHandle(profile?.handle)}</span>
            <span>
              <Trans>doesn’t have any followers yet.</Trans>
            </span>
          </div>
        }
        icon={<UsersIcon className="w-8 h-8 text-brand" />}
        hideCard
      />
    );
  }

  return (
    <div className="overflow-y-auto max-h-[80vh]" id="scrollableDiv">
      <InfiniteScroll
        dataLength={followers?.length ?? 0}
        scrollThreshold={SCROLL_THRESHOLD}
        hasMore={hasMore}
        next={next}
        loader={<InfiniteLoader />}
        scrollableTarget="scrollableDiv"
      >
        <div className="divide-y dark:divide-gray-700">
          {followers?.map((follower, index) => (
            <div className="p-5" key={follower?.wallet?.defaultProfile?.id}>
              {follower?.wallet?.defaultProfile ? (
                <UserProfile
                  profile={follower?.wallet?.defaultProfile as any}
                  isFollowing={follower?.wallet?.defaultProfile?.isFollowedByMe}
                  followPosition={index + 1}
                  followSource={FollowSource.FOLLOWERS_MODAL}
                  showBio
                  showFollow
                  showUserPreview={false}
                />
              ) : (
                <WalletProfile wallet={follower?.wallet as Wallet} />
              )}
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Followers;
