import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { useProfileQuery } from '@hey/lens';

import SmallUserProfileShimmer from './Shimmer/SmallUserProfileShimmer';
import SmallUserProfile from './SmallUserProfile';

interface UserProfileProps {
  hideSlug?: boolean;
  id: string;
  linkToProfile?: boolean;
  smallAvatar?: boolean;
}

const LazySmallUserProfile: FC<UserProfileProps> = ({
  hideSlug = false,
  id,
  linkToProfile = false,
  smallAvatar = false
}) => {
  const { data, loading } = useProfileQuery({
    variables: { request: { forProfileId: id } }
  });

  if (loading) {
    return <SmallUserProfileShimmer smallAvatar={smallAvatar} />;
  }

  if (!data?.profile) {
    return null;
  }

  return (
    <SmallUserProfile
      hideSlug={hideSlug}
      linkToProfile={linkToProfile}
      profile={data.profile as Profile}
      smallAvatar={smallAvatar}
    />
  );
};

export default LazySmallUserProfile;
