import UserProfileShimmer from "@components/Shared/Shimmer/UserProfileShimmer";
import type { FC } from "react";

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
