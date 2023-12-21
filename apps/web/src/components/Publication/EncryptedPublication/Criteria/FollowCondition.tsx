import type { FC } from 'react';

import LazySmallUserProfile from '@components/Shared/LazySmallUserProfile';
import { FollowCondition } from '@hey/lens';

interface FollowConditionProps {
  condition: FollowCondition;
}

const FollowCondition: FC<FollowConditionProps> = ({ condition }) => {
  return (
    <div className="flex items-center space-x-2">
      <div>Must follow the profile:</div>
      <LazySmallUserProfile id={condition.follow} linkToProfile />
    </div>
  );
};

export default FollowCondition;
