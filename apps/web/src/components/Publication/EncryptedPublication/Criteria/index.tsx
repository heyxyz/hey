import type {
  MirrorablePublication,
  SecondTierCondition as SecondTierConditionType
} from '@hey/lens';
import type { FC } from 'react';

import SecondTierCondition from './SecondTierCondition';

interface CriteriaProps {
  publication: MirrorablePublication;
}

const Criteria: FC<CriteriaProps> = ({ publication }) => {
  const { encryptedWith } = publication.metadata;
  const accessCondition = encryptedWith?.accessCondition;

  if (!accessCondition) {
    return null;
  }

  const getCriteria = (): SecondTierConditionType[] => {
    let { criteria } = accessCondition;

    // Remove duplicates __typename
    criteria = criteria.filter(
      (condition, index, self) =>
        index === self.findIndex((c) => c.__typename === condition.__typename)
    );

    return criteria;
  };

  return (
    <div className="space-y-3">
      {getCriteria().map((criterion, index) => (
        <SecondTierCondition
          condition={criterion}
          key={`${criterion.__typename}-${index}`}
        />
      ))}
    </div>
  );
};

export default Criteria;
