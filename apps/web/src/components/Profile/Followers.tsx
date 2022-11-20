import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import WalletProfile from '@components/Shared/WalletProfile';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import InfiniteLoader from '@components/UI/InfiniteLoader';
import { UsersIcon } from '@heroicons/react/outline';
import { SCROLL_THRESHOLD } from 'data/constants';
import type { Profile, Wallet } from 'lens';
import { useFollowersQuery } from 'lens';
import type { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
  profile: Profile;
}

const Followers: FC<Props> = ({ profile }) => {
  // Variables
  const request = { profileId: profile?.id, limit: 10 };

  const { data, loading, error, fetchMore } = useFollowersQuery({
    variables: { request },
    skip: !profile?.id
  });

  const followers = data?.followers?.items;
  const pageInfo = data?.followers?.pageInfo;
  const hasMore = pageInfo?.next && followers?.length !== pageInfo.totalCount;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  if (loading) {
    return <Loader message="Loading followers" />;
  }

  if (followers?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">@{profile?.handle}</span>
            <span>doesn’t have any followers yet.</span>
          </div>
        }
        icon={<UsersIcon className="w-8 h-8 text-brand" />}
        hideCard
      />
    );
  }

  return (
    <div className="overflow-y-auto max-h-[80vh]" id="scrollableDiv">
      <ErrorMessage className="m-5" title="Failed to load followers" error={error} />
      <InfiniteScroll
        dataLength={followers?.length ?? 0}
        scrollThreshold={SCROLL_THRESHOLD}
        hasMore={hasMore}
        next={loadMore}
        loader={<InfiniteLoader />}
        scrollableTarget="scrollableDiv"
      >
        <div className="divide-y dark:divide-gray-700">
          {followers?.map((follower) => (
            <div className="p-5" key={follower?.wallet?.defaultProfile?.id}>
              {follower?.wallet?.defaultProfile ? (
                <UserProfile
                  profile={follower?.wallet?.defaultProfile as Profile}
                  showBio
                  showFollow
                  isFollowing={follower?.wallet?.defaultProfile?.isFollowedByMe}
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
