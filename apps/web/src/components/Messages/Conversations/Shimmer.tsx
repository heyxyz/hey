import SingleProfileShimmer from "@components/Shared/Shimmer/SingleProfileShimmer";
import type { FC } from "react";

const ConversationsShimmer: FC = () => {
  return (
    <div className="space-y-5 px-5 py-3">
      <SingleProfileShimmer />
      <SingleProfileShimmer />
      <SingleProfileShimmer />
      <SingleProfileShimmer />
      <SingleProfileShimmer />
      <SingleProfileShimmer />
    </div>
  );
};

export default ConversationsShimmer;
