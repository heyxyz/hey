import { useQuery } from '@apollo/client';
import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import InfiniteLoader from '@components/UI/InfiniteLoader';
import type { Profile } from '@generated/types';
import { FollowingDocument } from '@generated/types';
import { UsersIcon } from '@heroicons/react/outline';
import type { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SCROLL_THRESHOLD } from 'src/constants';

interface Props {
  profile: Profile;
}

const Following: FC<Props> = ({ profile }) => {
  // Variables
  const request = { address: profile?.ownedBy, limit: 10 };

  const { data, loading, error, fetchMore } = useQuery(FollowingDocument, {
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
            <div className="p-5" key={following?.profile?.id}>
              <UserProfile
                profile={following?.profile as Profile}
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
