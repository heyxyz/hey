import { useAccountQuery } from "@hey/indexer";
import type { FC } from "react";
import SmallSingleAccountShimmer from "./Shimmer/SmallSingleAccountShimmer";
import SmallSingleAccount from "./SmallSingleAccount";

interface LazySmallSingleAccountProps {
  hideSlug?: boolean;
  address: string;
  linkToAccount?: boolean;
}

const LazySmallSingleAccount: FC<LazySmallSingleAccountProps> = ({
  hideSlug = false,
  address,
  linkToAccount = false
}) => {
  const { data, loading } = useAccountQuery({
    variables: { request: { address } }
  });

  if (loading) {
    return <SmallSingleAccountShimmer smallAvatar />;
  }

  if (!data?.account) {
    return null;
  }

  return (
    <SmallSingleAccount
      hideSlug={hideSlug}
      linkToAccount={linkToAccount}
      account={data.account}
      smallAvatar
    />
  );
};

export default LazySmallSingleAccount;
