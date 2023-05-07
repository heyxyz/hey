'use client';
import type {
  ApprovedAllowanceAmount,
  ApprovedModuleAllowanceAmountQuery
} from 'lens';
import { CollectModules } from 'lens';
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
          item?.module === CollectModules.RevertCollectModule ||
          item?.module === CollectModules.FreeCollectModule ? (
            ''
          ) : (
            <Module key={item?.contractAddress} module={item} />
          )
      )}
    </div>
  );
};

export default Allowance;
