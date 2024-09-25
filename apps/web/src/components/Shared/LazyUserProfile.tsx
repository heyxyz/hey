import type { Profile } from "@hey/lens";
import { useProfileQuery } from "@hey/lens";
import type { FC } from "react";
import SingleProfileShimmer from "./Shimmer/SingleProfileShimmer";
import SingleProfile from "./SingleProfile";

interface LazyUserProfileProps {
  id: string;
}

const LazyUserProfile: FC<LazyUserProfileProps> = ({ id }) => {
  const { data, loading } = useProfileQuery({
    variables: { request: { forProfileId: id } }
  });

  if (loading) {
    return <SingleProfileShimmer />;
  }

  if (!data?.profile) {
    return null;
  }

  return (
    <SingleProfile
      hideFollowButton
      hideUnfollowButton
      profile={data.profile as Profile}
    />
  );
};

export default LazyUserProfile;
