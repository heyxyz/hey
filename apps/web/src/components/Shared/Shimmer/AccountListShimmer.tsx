import type { FC } from "react";
import SingleAccountShimmer from "./SingleAccountShimmer";

const AccountListShimmer: FC = () => {
  return (
    <div className="divide-y dark:divide-gray-700">
      {Array.from({ length: 5 }).map((_, index) => (
        <SingleAccountShimmer
          key={index}
          className="p-5"
          showFollowUnfollowButton
        />
      ))}
    </div>
  );
};

export default AccountListShimmer;
