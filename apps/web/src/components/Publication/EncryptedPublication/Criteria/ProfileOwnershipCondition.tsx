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
      <div>Must be owned by</div>
      <LazySmallUserProfile id={condition.profileId} />
    </div>
  );
};

export default ProfileOwnershipCondition;
