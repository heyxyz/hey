import type { ProfileOwnershipCondition as ProfileOwnershipConditionType } from '@hey/lens';
import type { FC } from 'react';

import LazySmallUserProfile from '@components/Shared/LazySmallUserProfile';

interface ProfileOwnershipConditionProps {
  condition: ProfileOwnershipConditionType;
}

const ProfileOwnershipCondition: FC<ProfileOwnershipConditionProps> = ({
  condition
}) => {
  return (
    <div className="flex flex-col items-start gap-0 sm:flex-row sm:items-center sm:gap-2">
      <div>Must own the profile:</div>
      <LazySmallUserProfile id={condition.profileId} linkToProfile />
    </div>
  );
};

export default ProfileOwnershipCondition;
