import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { useProfileQuery } from '@hey/lens';

import SmallUserProfileShimmer from './Shimmer/SmallUserProfileShimmer';
import SmallUserProfile from './SmallUserProfile';

interface UserProfileProps {
  id: string;
  linkToProfile?: boolean;
}

const LazySmallUserProfile: FC<UserProfileProps> = ({
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
    <SmallUserProfile
      linkToProfile={linkToProfile}
      profile={data.profile as Profile}
      smallAvatar
    />
  );
};

export default LazySmallUserProfile;
