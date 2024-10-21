import ProfileListShimmer from "@components/Shared/Shimmer/ProfileListShimmer";
import SingleProfile from "@components/Shared/SingleProfile";
import { UsersIcon } from "@heroicons/react/24/outline";
import { ProfileLinkSource } from "@hey/data/tracking";
import type { FollowersRequest, Profile } from "@hey/lens";
import { LimitType, useFollowersQuery } from "@hey/lens";
import { EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useProfileStore } from "src/store/persisted/useProfileStore";

interface FollowersProps {
  handle: string;
  profileId: string;
}

const Followers: FC<FollowersProps> = ({ handle, profileId }) => {
  const { currentProfile } = useProfileStore();

  const request: FollowersRequest = {
    limit: LimitType.TwentyFive,
    of: profileId
  };

  const { data, error, fetchMore, loading } = useFollowersQuery({
    skip: !profileId,
    variables: { request }
  });

  const followers = data?.followers?.items;
  const pageInfo = data?.followers?.pageInfo;
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

  if (followers?.length === 0) {
    return (
      <EmptyState
        icon={<UsersIcon className="size-8" />}
        message={
          <div>
            <span className="mr-1 font-bold">@{handle}</span>
            <span>doesn’t have any followers yet.</span>
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
        title="Failed to load followers"
      />
    );
  }

  return (
    <Virtuoso
      className="virtual-profile-list"
      computeItemKey={(index, follower) => `${follower.id}-${index}`}
      data={followers}
      endReached={onEndReached}
      itemContent={(_, follower) => (
        <div className="p-5">
          <SingleProfile
            hideFollowButton={currentProfile?.id === follower.id}
            hideUnfollowButton={currentProfile?.id === follower.id}
            profile={follower as Profile}
            showBio
            showUserPreview={false}
            source={ProfileLinkSource.Followers}
          />
        </div>
      )}
    />
  );
};

export default Followers;
