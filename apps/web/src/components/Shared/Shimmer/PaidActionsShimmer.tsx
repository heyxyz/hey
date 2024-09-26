import { Card } from "@hey/ui";
import type { FC } from "react";
import PublicationShimmer from "./PublicationShimmer";
import SingleProfileShimmer from "./SingleProfileShimmer";
import SmallSingleProfileShimmer from "./SmallSingleProfileShimmer";

const PaidActionsShimmer: FC = () => {
  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center space-x-2 px-5 py-3">
          <div className="shimmer h-3 w-3/12 rounded-full" />
          <SmallSingleProfileShimmer smallAvatar />
        </div>
        <div className="divider" />
        <PublicationShimmer />
      </Card>
      <Card>
        <div className="flex items-center space-x-2 p-5">
          <div className="shimmer h-3 w-3/12 rounded-full" />
          <SmallSingleProfileShimmer smallAvatar />
        </div>
        <div className="divider" />
        <div className="p-5">
          <SingleProfileShimmer isBig showFollowUnfollowButton />
        </div>
      </Card>
      <Card>
        <div className="flex items-center space-x-2 p-5">
          <div className="shimmer h-3 w-3/12 rounded-full" />
          <SmallSingleProfileShimmer smallAvatar />
        </div>
        <PublicationShimmer />
      </Card>
    </div>
  );
};

export default PaidActionsShimmer;
