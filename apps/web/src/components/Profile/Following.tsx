import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import InfiniteLoader from '@components/UI/InfiniteLoader';
import { UsersIcon } from '@heroicons/react/outline';
import { SCROLL_THRESHOLD } from 'data/constants';
import type { Profile } from 'lens';
import { useFollowingQuery } from 'lens';
import type { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
  profile: Profile;
  onProfileSelected?: (profile: Profile) => void;
}

const Following: FC<Props> = ({ profile, onProfileSelected }) => {
  // Variables
  const request = { address: profile?.ownedBy, limit: 10 };

  const { data, loading, error, fetchMore } = useFollowingQuery({
    variables: { request },
    skip: !profile?.id
  });

  const followings = data?.following?.items;
  const pageInfo = data?.following?.pageInfo;
  const hasMore = pageInfo?.next && followings?.length !== pageInfo.totalCount;

  const loadMore = async () => {
    await fetchMore({
      variables: {
        request: { ...request, cursor: pageInfo?.next }
      }
    });
  };

  if (loading) {
    return <Loader message="Loading following" />;
  }

  if (followings?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">@{profile?.handle}</span>
            <span>doesn’t follow anyone.</span>
          </div>
        }
        icon={<UsersIcon className="w-8 h-8 text-brand" />}
        hideCard
      />
    );
  }

  return (
    <div className="overflow-y-auto max-h-[80vh]" id="scrollableDiv">
      <ErrorMessage className="m-5" title="Failed to load following" error={error} />
      <InfiniteScroll
        dataLength={followings?.length ?? 0}
        scrollThreshold={SCROLL_THRESHOLD}
        hasMore={hasMore}
        next={loadMore}
        loader={<InfiniteLoader />}
        scrollableTarget="scrollableDiv"
      >
        <div className="divide-y dark:divide-gray-700">
          {followings?.map((following) => (
            <div
              className={`p-5 ${
                onProfileSelected && 'hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer'
              }`}
              key={following?.profile?.id}
              onClick={
                onProfileSelected && following.profile
                  ? () => {
                      onProfileSelected(following.profile as Profile);
                    }
                  : undefined
              }
            >
              <UserProfile
                profile={following?.profile as Profile}
                linkToProfile={!onProfileSelected}
                showBio
                showFollow
                isFollowing={following?.profile?.isFollowedByMe}
              />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Following;
