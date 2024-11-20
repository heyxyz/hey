import type { Profile } from "@hey/lens";
import { useProfileQuery } from "@hey/lens";
import type { FC } from "react";
import SmallSingleAccountShimmer from "./Shimmer/SmallSingleAccountShimmer";
import SmallSingleAccount from "./SmallSingleAccount";

interface LazySmallSingleAccountProps {
  hideSlug?: boolean;
  id: string;
  linkToAccount?: boolean;
}

const LazySmallSingleAccount: FC<LazySmallSingleAccountProps> = ({
  hideSlug = false,
  id,
  linkToAccount = false
}) => {
  const { data, loading } = useProfileQuery({
    variables: { request: { forProfileId: id } }
  });

  if (loading) {
    return <SmallSingleAccountShimmer smallAvatar />;
  }

  if (!data?.profile) {
    return null;
  }

  return (
    <SmallSingleAccount
      hideSlug={hideSlug}
      linkToAccount={linkToAccount}
      account={data.profile as Profile}
      smallAvatar
    />
  );
};

export default LazySmallSingleAccount;
