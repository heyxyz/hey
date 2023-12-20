import type { FC } from 'react';

import { ThirdTierCondition } from '@hey/lens';
import isFeatureEnabled from '@lib/isFeatureEnabled';

interface ThirdTierConditionProps {
  condition: ThirdTierCondition;
}

const ThirdTierCondition: FC<ThirdTierConditionProps> = ({ condition }) => {
  if (!isFeatureEnabled('token-gated')) {
    return null;
  }

  return (
    <div>
      {condition.__typename}
      {condition.__typename === 'ProfileOwnershipCondition' ? (
        <span> {condition.profileId}</span>
      ) : null}
    </div>
  );
};

export default ThirdTierCondition;
