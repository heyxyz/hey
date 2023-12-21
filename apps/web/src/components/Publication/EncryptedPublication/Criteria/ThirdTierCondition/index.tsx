import type { FC } from 'react';

import { ThirdTierCondition } from '@hey/lens';

import CollectCondition from '../CollectCondition';
import EoaOwnershipCondition from '../EoaOwnershipCondition';
import FollowCondition from '../FollowCondition';
import NftOwnershipCondition from '../NftOwnershipCondition';
import ProfileOwnershipCondition from '../ProfileOwnershipCondition';

interface ThirdTierConditionProps {
  condition: ThirdTierCondition;
}

const ThirdTierCondition: FC<ThirdTierConditionProps> = ({ condition }) => {
  return (
    <div className="space-y-1.5">
      {condition.__typename === 'ProfileOwnershipCondition' && (
        <ProfileOwnershipCondition condition={condition} />
      )}
      {condition.__typename === 'EoaOwnershipCondition' && (
        <EoaOwnershipCondition condition={condition} />
      )}
      {condition.__typename === 'NftOwnershipCondition' && (
        <NftOwnershipCondition condition={condition} />
      )}
      {condition.__typename === 'CollectCondition' && (
        <CollectCondition condition={condition} />
      )}
      {condition.__typename === 'FollowCondition' && (
        <FollowCondition condition={condition} />
      )}
    </div>
  );
};

export default ThirdTierCondition;
