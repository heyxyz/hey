import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { useProfileQuery } from '@hey/lens';

interface StaffPickedProfileProps {
  id: string;
}

const StaffPickedProfile: FC<StaffPickedProfileProps> = ({ id }) => {
  const { data, loading } = useProfileQuery({
    skip: !id,
    variables: { request: { forProfileId: id } }
  });

  if (loading) {
    return <UserProfileShimmer />;
  }

  if (!data?.profile) {
    return null;
  }

  return <UserProfile profile={data.profile as Profile} />;
};

export default StaffPickedProfile;
