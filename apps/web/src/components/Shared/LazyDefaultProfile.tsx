import type { Profile } from "@hey/lens";
import type { FC } from "react";
import type { Address } from "viem";

import { useDefaultProfileQuery } from "@hey/lens";

import UserProfileShimmer from "./Shimmer/UserProfileShimmer";
import UserProfile from "./UserProfile";
import WalletProfile from "./WalletProfile";

interface LazyDefaultProfileProps {
  address: Address;
}

const LazyDefaultProfile: FC<LazyDefaultProfileProps> = ({ address }) => {
  const { data, loading } = useDefaultProfileQuery({
    skip: !address,
    variables: { request: { for: address } }
  });

  if (loading) {
    return <UserProfileShimmer />;
  }

  if (!data?.defaultProfile) {
    return <WalletProfile address={address} />;
  }

  return (
    <UserProfile
      hideFollowButton
      hideUnfollowButton
      profile={data.defaultProfile as Profile}
    />
  );
};

export default LazyDefaultProfile;
