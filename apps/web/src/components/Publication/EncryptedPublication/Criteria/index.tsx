import type { RootCondition } from '@hey/lens';
import type { FC } from 'react';

import isFeatureEnabled from '@lib/isFeatureEnabled';

import SecondTierCondition from './SecondTierCondition';

interface CriteriaProps {
  accessCondition: RootCondition;
}

const Criteria: FC<CriteriaProps> = ({ accessCondition }) => {
  if (!isFeatureEnabled('token-gated')) {
    return null;
  }

  return accessCondition?.criteria.map((criterion) => (
    <SecondTierCondition condition={criterion} key={criterion.__typename} />
  ));
};

export default Criteria;
