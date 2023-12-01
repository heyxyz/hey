import type { Profile } from '@hey/lens';
import { useProfileQuery } from '@hey/lens';
import { type FC } from 'react';

import UserProfileShimmer from '@/components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@/components/Shared/UserProfile';

interface StaffPickedProfileProps {
  id: string;
}

const StaffPickedProfile: FC<StaffPickedProfileProps> = ({ id }) => {
  const { data, loading } = useProfileQuery({
    variables: { request: { forProfileId: id } },
    skip: !id
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
