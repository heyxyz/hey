import type { RootCondition } from '@hey/lens';
import type { FC } from 'react';

import isFeatureEnabled from '@lib/isFeatureEnabled';

interface CriteriaProps {
  accessCondition: RootCondition;
}

const Criteria: FC<CriteriaProps> = ({ accessCondition }) => {
  if (!isFeatureEnabled('token-gated')) {
    return null;
  }

  return (
    <div>
      {accessCondition?.criteria.map((criterion) => (
        <div key={criterion.__typename}>
          {criterion.__typename}
          {criterion.__typename === 'ProfileOwnershipCondition' ? (
            <span> {criterion.profileId}</span>
          ) : null}

          {criterion.__typename === 'AndCondition' ? (
            <div className="ml-5">
              {criterion.criteria.map((criterion) => (
                <div key={criterion.__typename}>
                  {criterion.__typename}
                  {criterion.__typename === 'ProfileOwnershipCondition' ? (
                    <span> {criterion.profileId}</span>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          {criterion.__typename === 'OrCondition' ? (
            <div className="ml-5">
              {criterion.criteria.map((criterion) => (
                <div key={criterion.__typename}>
                  {criterion.__typename}
                  {criterion.__typename === 'ProfileOwnershipCondition' ? (
                    <span> {criterion.profileId}</span>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default Criteria;
