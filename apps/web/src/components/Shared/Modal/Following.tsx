import ProfileListShimmer from "@components/Shared/Shimmer/ProfileListShimmer";
import UserProfile from "@components/Shared/UserProfile";
import { UsersIcon } from "@heroicons/react/24/outline";
import { ProfileLinkSource } from "@hey/data/tracking";
import type { FollowingRequest, Profile } from "@hey/lens";
import { LimitType, useFollowingQuery } from "@hey/lens";
import { EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useProfileStore } from "src/store/persisted/useProfileStore";

interface FollowingProps {
  handle: string;
  profileId: string;
}

const Following: FC<FollowingProps> = ({ handle, profileId }) => {
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
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  if (loading) {
    return <ProfileListShimmer />;
  }

  if (followings?.length === 0) {
    return (
      <EmptyState
        icon={<UsersIcon className="size-8" />}
        message={
          <div>
            <span className="mr-1 font-bold">@{handle}</span>
            <span>doesn’t follow anyone.</span>
          </div>
        }
        hideCard
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
    <Virtuoso
      className="virtual-profile-list"
      computeItemKey={(index, following) => `${following.id}-${index}`}
      data={followings}
      endReached={onEndReached}
      itemContent={(_, following) => (
        <div className="p-5">
          <UserProfile
            hideFollowButton={currentProfile?.id === following.id}
            hideUnfollowButton={currentProfile?.id === following.id}
            profile={following as Profile}
            showBio
            showUserPreview={false}
            source={ProfileLinkSource.Following}
          />
        </div>
      )}
    />
  );
};

export default Following;
