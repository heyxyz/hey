import type { Profile } from "@hey/lens";
import { useProfileQuery } from "@hey/lens";
import type { FC } from "react";
import SmallUserProfileShimmer from "./Shimmer/SmallUserProfileShimmer";
import SmallSingleProfile from "./SmallSingleProfile";

interface LazySmallSingleProfileProps {
  hideSlug?: boolean;
  id: string;
  linkToProfile?: boolean;
}

const LazySmallSingleProfile: FC<LazySmallSingleProfileProps> = ({
  hideSlug = false,
  id,
  linkToProfile = false
}) => {
  const { data, loading } = useProfileQuery({
    variables: { request: { forProfileId: id } }
  });

  if (loading) {
    return <SmallUserProfileShimmer smallAvatar />;
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

export default LazySmallSingleProfile;
