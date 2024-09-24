import UserProfileShimmer from "@components/Shared/Shimmer/UserProfileShimmer";
import type { FC } from "react";

const ProfileListShimmer: FC = () => {
  return (
    <div className="divide-y dark:divide-gray-700">
      <UserProfileShimmer className="p-5" showFollowUnfollowButton />
      <UserProfileShimmer className="p-5" showFollowUnfollowButton />
      <UserProfileShimmer className="p-5" showFollowUnfollowButton />
      <UserProfileShimmer className="p-5" showFollowUnfollowButton />
      <UserProfileShimmer className="p-5" showFollowUnfollowButton />
    </div>
  );
};

export default ProfileListShimmer;
