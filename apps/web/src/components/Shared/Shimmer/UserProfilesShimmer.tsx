import type { FC } from "react";

import { Card } from "@hey/ui";

import UserProfileShimmer from "./UserProfileShimmer";

interface UserProfilesShimmerProps {
  isBig?: boolean;
  showFollowUnfollowButton?: boolean;
}

const UserProfilesShimmer: FC<UserProfilesShimmerProps> = ({
  isBig = false,
  showFollowUnfollowButton = false
}) => {
  return (
    <div className="space-y-3">
      <Card className="p-5">
        <UserProfileShimmer
          isBig={isBig}
          showFollowUnfollowButton={showFollowUnfollowButton}
        />
      </Card>
      <Card className="p-5">
        <UserProfileShimmer
          isBig={isBig}
          showFollowUnfollowButton={showFollowUnfollowButton}
        />
      </Card>
      <Card className="p-5">
        <UserProfileShimmer
          isBig={isBig}
          showFollowUnfollowButton={showFollowUnfollowButton}
        />
      </Card>
    </div>
  );
};

export default UserProfilesShimmer;
