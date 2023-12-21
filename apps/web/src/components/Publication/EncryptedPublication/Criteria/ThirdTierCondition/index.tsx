import type { FC } from 'react';

import { ThirdTierCondition } from '@hey/lens';

import ProfileOwnershipCondition from '../ProfileOwnershipCondition';
import EoaOwnershipCondition from '../ProfileOwnershipCondition copy';

interface ThirdTierConditionProps {
  condition: ThirdTierCondition;
}

const ThirdTierCondition: FC<ThirdTierConditionProps> = ({ condition }) => {
  return (
    <div>
      {condition.__typename === 'ProfileOwnershipCondition' ? (
        <ProfileOwnershipCondition condition={condition} />
      ) : null}
      {condition.__typename === 'EoaOwnershipCondition' ? (
        <EoaOwnershipCondition condition={condition} />
      ) : null}
      {condition.__typename === 'NftOwnershipCondition' ? (
        <div>{condition.contract.address}</div>
      ) : null}
    </div>
  );
};

export default ThirdTierCondition;
