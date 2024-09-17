import type { FC } from "react";

import UserProfileShimmer from "@components/Shared/Shimmer/UserProfileShimmer";

const ConversationsShimmer: FC = () => {
  return (
    <div className="space-y-5 px-5 py-3">
      <UserProfileShimmer />
      <UserProfileShimmer />
      <UserProfileShimmer />
      <UserProfileShimmer />
      <UserProfileShimmer />
      <UserProfileShimmer />
    </div>
  );
};

export default ConversationsShimmer;
