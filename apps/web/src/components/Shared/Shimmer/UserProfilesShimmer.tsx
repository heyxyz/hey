import { Card } from "@hey/ui";
import type { FC } from "react";
import SingleProfileShimmer from "./SingleProfileShimmer";

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
        <SingleProfileShimmer
          isBig={isBig}
          showFollowUnfollowButton={showFollowUnfollowButton}
        />
      </Card>
      <Card className="p-5">
        <SingleProfileShimmer
          isBig={isBig}
          showFollowUnfollowButton={showFollowUnfollowButton}
        />
      </Card>
      <Card className="p-5">
        <SingleProfileShimmer
          isBig={isBig}
          showFollowUnfollowButton={showFollowUnfollowButton}
        />
      </Card>
    </div>
  );
};

export default UserProfilesShimmer;
