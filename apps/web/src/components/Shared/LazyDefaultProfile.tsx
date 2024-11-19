import type { Profile } from "@hey/lens";
import { useDefaultProfileQuery } from "@hey/lens";
import type { FC } from "react";
import type { Address } from "viem";
import SingleAccountShimmer from "./Shimmer/SingleAccountShimmer";
import SingleAccount from "./SingleAccount";
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
    return <SingleAccountShimmer />;
  }

  if (!data?.defaultProfile) {
    return <WalletProfile address={address} />;
  }

  return (
    <SingleAccount
      hideFollowButton
      hideUnfollowButton
      profile={data.defaultProfile as Profile}
    />
  );
};

export default LazyDefaultProfile;
