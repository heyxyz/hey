import type { Erc20OwnershipCondition as Erc20OwnershipConditionType } from '@hey/lens';
import type { FC } from 'react';

import { ComparisonOperatorConditionType } from '@hey/lens';

interface Erc20OwnershipConditionProps {
  condition: Erc20OwnershipConditionType;
}

const Erc20OwnershipCondition: FC<Erc20OwnershipConditionProps> = ({
  condition
}) => {
  const { amount, condition: erc20Condition } = condition;

  const getComparisionString = (condition: ComparisonOperatorConditionType) => {
    switch (condition) {
      case ComparisonOperatorConditionType.Equal:
        return 'Exactly';
      case ComparisonOperatorConditionType.GreaterThan:
        return 'Greater than';
      case ComparisonOperatorConditionType.GreaterThanOrEqual:
        return 'Greater than or equal to';
      case ComparisonOperatorConditionType.LessThan:
        return 'Less than';
      case ComparisonOperatorConditionType.LessThanOrEqual:
        return 'Less than or equal to';
      case ComparisonOperatorConditionType.NotEqual:
        return 'Not equal to';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div>Must own the ERC20 token:</div>
      <div>
        <b>{getComparisionString(erc20Condition)} </b>
        {amount.value} {amount.asset.symbol}
      </div>
    </div>
  );
};

export default Erc20OwnershipCondition;
