import type { Profile } from "@hey/lens";
import { useDefaultProfileQuery } from "@hey/lens";
import type { FC } from "react";
import type { Address } from "viem";
import SingleAccountShimmer from "./Shimmer/SingleAccountShimmer";
import SingleAccount from "./SingleAccount";
import WalletAccount from "./WalletAccount";

interface LazyDefaultAccountProps {
  address: Address;
}

const LazyDefaultAccount: FC<LazyDefaultAccountProps> = ({ address }) => {
  const { data, loading } = useDefaultProfileQuery({
    skip: !address,
    variables: { request: { for: address } }
  });

  if (loading) {
    return <SingleAccountShimmer />;
  }

  if (!data?.defaultProfile) {
    return <WalletAccount address={address} />;
  }

  return (
    <SingleAccount
      hideFollowButton
      hideUnfollowButton
      account={data.defaultProfile as Profile}
    />
  );
};

export default LazyDefaultAccount;
