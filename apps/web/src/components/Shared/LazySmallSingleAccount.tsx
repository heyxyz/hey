import type { Profile } from "@hey/lens";
import { useProfileQuery } from "@hey/lens";
import type { FC } from "react";
import SmallSingleAccountShimmer from "./Shimmer/SmallSingleAccountShimmer";
import SmallSingleProfile from "./SmallSingleProfile";

interface LazySmallSingleAccountProps {
  hideSlug?: boolean;
  id: string;
  linkToProfile?: boolean;
}

const LazySmallSingleAccount: FC<LazySmallSingleAccountProps> = ({
  hideSlug = false,
  id,
  linkToProfile = false
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
    <SmallSingleProfile
      hideSlug={hideSlug}
      linkToProfile={linkToProfile}
      profile={data.profile as Profile}
      smallAvatar
    />
  );
};

export default LazySmallSingleAccount;
