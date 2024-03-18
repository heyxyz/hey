import type { FollowingRequest, Profile } from '@hey/lens';
import type { FC } from 'react';

import ProfileListShimmer from '@components/Shared/Shimmer/ProfileListShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { ArrowLeftIcon, UsersIcon } from '@heroicons/react/24/outline';
import { ProfileLinkSource } from '@hey/data/tracking';
import { LimitType, useFollowingQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import Link from 'next/link';
import { Virtuoso } from 'react-virtuoso';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

interface FollowingProps {
  handle: string;
  profileId: string;
}

const Following: FC<FollowingProps> = ({ handle, profileId }) => {
  // Variables
  const request: FollowingRequest = {
    for: profileId,
    limit: LimitType.TwentyFive
  };
  const { currentProfile } = useProfileStore();

  const { data, error, fetchMore, loading } = useFollowingQuery({
    skip: !profileId,
    variables: { request }
  });

  const followings = data?.following?.items;
  const pageInfo = data?.following?.pageInfo;
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

  if (followings?.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<UsersIcon className="size-8" />}
        message={
          <div>
            <span className="mr-1 font-bold">@{handle}</span>
            <span>doesn’t follow anyone.</span>
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
        title="Failed to load following"
      />
    );
  }

  return (
    <Card>
      <div className="flex items-center space-x-3 p-5">
        <Link href={`/u/${handle}`}>
          <ArrowLeftIcon className="size-5" />
        </Link>
        <b className="text-lg">Following</b>
      </div>
      <div className="divider" />
      <Virtuoso
        className="virtual-divider-list-window"
        computeItemKey={(_, following) => following.id}
        data={followings}
        endReached={onEndReached}
        itemContent={(_, following) => {
          return (
            <div className="p-5">
              <UserProfile
                profile={following as Profile}
                showBio
                showFollowUnfollowButton={currentProfile?.id !== following.id}
                showUserPreview={false}
                source={ProfileLinkSource.Following}
              />
            </div>
          );
        }}
        useWindowScroll
      />
    </Card>
  );
};

export default Following;
