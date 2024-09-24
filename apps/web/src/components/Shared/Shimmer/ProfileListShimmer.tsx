import UserProfileShimmer from "@components/Shared/Shimmer/UserProfileShimmer";
import type { FC } from "react";

const ProfileListShimmer: FC = () => {
  return (
    <div className="divide-y dark:divide-gray-700">
      {Array.from({ length: 5 }).map((_, index) => (
        <UserProfileShimmer
          key={index}
          className="p-5"
          showFollowUnfollowButton
        />
      ))}
    </div>
  );
};

export default ProfileListShimmer;
