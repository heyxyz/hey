import type { Profile } from "@hey/lens";
import { useDefaultProfileQuery } from "@hey/lens";
import type { FC } from "react";
import type { Address } from "viem";
import SingleProfileShimmer from "./Shimmer/SingleProfileShimmer";
import SingleProfile from "./SingleProfile";
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
    return <SingleProfileShimmer />;
  }

  if (!data?.defaultProfile) {
    return <WalletProfile address={address} />;
  }

  return (
    <SingleProfile
      hideFollowButton
      hideUnfollowButton
      profile={data.defaultProfile as Profile}
    />
  );
};

export default LazyDefaultProfile;
