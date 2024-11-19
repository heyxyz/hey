import { Card } from "@hey/ui";
import type { FC } from "react";
import SingleAccountShimmer from "./SingleAccountShimmer";

interface SingleProfilesShimmerProps {
  isBig?: boolean;
  showFollowUnfollowButton?: boolean;
}

const SingleProfilesShimmer: FC<SingleProfilesShimmerProps> = ({
  isBig = false,
  showFollowUnfollowButton = false
}) => {
  return (
    <div className="space-y-3">
      <Card className="p-5">
        <SingleAccountShimmer
          isBig={isBig}
          showFollowUnfollowButton={showFollowUnfollowButton}
        />
      </Card>
      <Card className="p-5">
        <SingleAccountShimmer
          isBig={isBig}
          showFollowUnfollowButton={showFollowUnfollowButton}
        />
      </Card>
      <Card className="p-5">
        <SingleAccountShimmer
          isBig={isBig}
          showFollowUnfollowButton={showFollowUnfollowButton}
        />
      </Card>
    </div>
  );
};

export default SingleProfilesShimmer;
