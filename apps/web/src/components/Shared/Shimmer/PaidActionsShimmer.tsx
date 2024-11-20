import { Card } from "@hey/ui";
import type { FC } from "react";
import PostShimmer from "./PostShimmer";
import SingleAccountShimmer from "./SingleAccountShimmer";
import SmallSingleAccountShimmer from "./SmallSingleAccountShimmer";

const PaidActionsShimmer: FC = () => {
  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center space-x-2 px-5 py-3">
          <div className="shimmer h-3 w-3/12 rounded-full" />
          <SmallSingleAccountShimmer smallAvatar />
        </div>
        <div className="divider" />
        <PostShimmer />
      </Card>
      <Card>
        <div className="flex items-center space-x-2 p-5">
          <div className="shimmer h-3 w-3/12 rounded-full" />
          <SmallSingleAccountShimmer smallAvatar />
        </div>
        <div className="divider" />
        <div className="p-5">
          <SingleAccountShimmer isBig showFollowUnfollowButton />
        </div>
      </Card>
      <Card>
        <div className="flex items-center space-x-2 p-5">
          <div className="shimmer h-3 w-3/12 rounded-full" />
          <SmallSingleAccountShimmer smallAvatar />
        </div>
        <PostShimmer />
      </Card>
    </div>
  );
};

export default PaidActionsShimmer;
