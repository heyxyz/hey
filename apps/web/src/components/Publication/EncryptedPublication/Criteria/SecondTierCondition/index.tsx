import type { FC } from 'react';

import { SecondTierCondition } from '@hey/lens';
import isFeatureEnabled from '@lib/isFeatureEnabled';

import ThirdTierCondition from '../ThirdTierCondition';

interface SecondTierConditionProps {
  condition: SecondTierCondition;
}

const SecondTierCondition: FC<SecondTierConditionProps> = ({ condition }) => {
  if (!isFeatureEnabled('token-gated')) {
    return null;
  }

  return (
    <div>
      {condition.__typename === 'AndCondition' ? (
        <div className="space-y-3">
          <div className="font-bold">
            Should match all of the following conditions:
          </div>
          <div>
            {condition.criteria.map((criterion) => (
              <ThirdTierCondition
                condition={criterion}
                key={criterion.__typename}
              />
            ))}
          </div>
        </div>
      ) : null}

      {condition.__typename === 'OrCondition' ? (
        <div className="space-y-3">
          <div className="font-bold">
            Should match any of the following conditions:
          </div>
          <div>
            {condition.criteria.map((criterion) => (
              <ThirdTierCondition
                condition={criterion}
                key={criterion.__typename}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SecondTierCondition;
