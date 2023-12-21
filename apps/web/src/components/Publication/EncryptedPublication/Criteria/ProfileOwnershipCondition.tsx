import type { FC } from 'react';

import LazySmallUserProfile from '@components/Shared/LazySmallUserProfile';
import { ProfileOwnershipCondition } from '@hey/lens';

interface ProfileOwnershipConditionProps {
  condition: ProfileOwnershipCondition;
}

const ProfileOwnershipCondition: FC<ProfileOwnershipConditionProps> = ({
  condition
}) => {
  return (
    <div className="flex items-center space-x-2">
      <div>Must own the profile:</div>
      <LazySmallUserProfile id={condition.profileId} linkToProfile />
    </div>
  );
};

export default ProfileOwnershipCondition;
