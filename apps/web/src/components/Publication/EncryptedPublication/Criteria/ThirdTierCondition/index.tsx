import type { FC } from 'react';

import { ThirdTierCondition } from '@hey/lens';

import CollectCondition from '../CollectCondition';
import EoaOwnershipCondition from '../EoaOwnershipCondition';
import NftOwnershipCondition from '../NftOwnershipCondition';
import ProfileOwnershipCondition from '../ProfileOwnershipCondition';

interface ThirdTierConditionProps {
  condition: ThirdTierCondition;
}

const ThirdTierCondition: FC<ThirdTierConditionProps> = ({ condition }) => {
  return (
    <div className="space-y-1.5">
      {condition.__typename === 'ProfileOwnershipCondition' ? (
        <ProfileOwnershipCondition condition={condition} />
      ) : null}
      {condition.__typename === 'EoaOwnershipCondition' ? (
        <EoaOwnershipCondition condition={condition} />
      ) : null}
      {condition.__typename === 'NftOwnershipCondition' ? (
        <NftOwnershipCondition condition={condition} />
      ) : null}
      {condition.__typename === 'CollectCondition' ? (
        <CollectCondition condition={condition} />
      ) : null}
    </div>
  );
};

export default ThirdTierCondition;
