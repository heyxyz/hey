import type {
  ApprovedAllowanceAmount,
  ApprovedModuleAllowanceAmountQuery
} from '@lenster/lens';
import { CollectModules } from '@lenster/lens';
import type { FC } from 'react';

import Module from './Module';

interface AllowanceProps {
  allowance: ApprovedModuleAllowanceAmountQuery | undefined;
}

const Allowance: FC<AllowanceProps> = ({ allowance }) => {
  return (
    <div className="space-y-4 p-5">
      {allowance?.approvedModuleAllowanceAmount?.map(
        (item: ApprovedAllowanceAmount) =>
          item?.module === CollectModules.RevertCollectModule ? (
            ''
          ) : (
            <Module key={item?.contractAddress} module={item} />
          )
      )}
    </div>
  );
};

export default Allowance;
