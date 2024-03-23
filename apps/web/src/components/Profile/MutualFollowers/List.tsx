import type { MutualFollowersRequest, Profile } from '@hey/lens';
import type { FC } from 'react';

import ProfileListShimmer from '@components/Shared/Shimmer/ProfileListShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { ArrowLeftIcon, UsersIcon } from '@heroicons/react/24/outline';
import { LimitType, useMutualFollowersQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import Link from 'next/link';
import { Virtuoso } from 'react-virtuoso';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

interface MutualFollowersListProps {
  handle: string;
  profileId: string;
}

const MutualFollowersList: FC<MutualFollowersListProps> = ({
  handle,
  profileId
}) => {
  const { currentProfile } = useProfileStore();

  // Variables
  const request: MutualFollowersRequest = {
    limit: LimitType.TwentyFive,
    observer: currentProfile?.id,
    viewing: profileId
  };

  const { data, error, fetchMore, loading } = useMutualFollowersQuery({
    skip: !profileId,
    variables: { request }
  });

  const mutualFollowers = data?.mutualFollowers?.items;
  const pageInfo = data?.mutualFollowers?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  if (loading) {
    return <ProfileListShimmer />;
  }

  if (mutualFollowers?.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<UsersIcon className="size-8" />}
        message={
          <div>
            <span className="mr-1 font-bold">{handle}</span>
            <span>doesn’t have any mutual followers.</span>
          </div>
        }
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load mutual followers"
      />
    );
  }

  return (
    <Card>
      <div className="flex items-center space-x-3 p-5">
        <Link href={`/u/${handle}`}>
          <ArrowLeftIcon className="size-5" />
        </Link>
        <b className="text-lg">Mutual Followers</b>
      </div>
      <div className="divider" />
      <Virtuoso
        className="virtual-divider-list-window"
        computeItemKey={(index, mutualFollower) =>
          `${mutualFollower.id}-${index}`
        }
        data={mutualFollowers}
        endReached={onEndReached}
        itemContent={(_, mutualFollower) => {
          return (
            <div className="p-5">
              <UserProfile
                hideFollowButton={currentProfile?.id === mutualFollower.id}
                hideUnfollowButton={currentProfile?.id === mutualFollower.id}
                profile={mutualFollower as Profile}
                showBio
                showUserPreview={false}
              />
            </div>
          );
        }}
        useWindowScroll
      />
    </Card>
  );
};

export default MutualFollowersList;
