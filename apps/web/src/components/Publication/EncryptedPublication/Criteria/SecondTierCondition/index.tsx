import type { FC } from 'react';

import { SecondTierCondition } from '@hey/lens';

import ThirdTierCondition from '../ThirdTierCondition';

interface SecondTierConditionProps {
  condition: SecondTierCondition;
}

const SecondTierCondition: FC<SecondTierConditionProps> = ({ condition }) => {
  return (
    <div>
      <ThirdTierCondition condition={condition as ThirdTierCondition} />

      {condition.__typename === 'AndCondition' ? (
        <div className="space-y-3">
          <div className="font-bold">
            Should match all of the following conditions:
          </div>
          <div className="ml-5 space-y-1.5">
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
            Should match any one of the following conditions:
          </div>
          <div className="ml-5 space-y-1.5">
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
