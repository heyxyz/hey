import type { ApprovedModuleAllowanceAmountQuery } from '@lenster/lens';
import { OpenActionModuleType } from '@lenster/lens';
import type { FC } from 'react';

import Module from './Module';

interface AllowanceProps {
  allowance: ApprovedModuleAllowanceAmountQuery | undefined;
}

const Allowance: FC<AllowanceProps> = ({ allowance }) => {
  return (
    <div className="space-y-4 p-5">
      {allowance?.approvedModuleAllowanceAmount?.map((item) =>
        item?.moduleName === OpenActionModuleType.LegacyRevertCollectModule ? (
          ''
        ) : (
          <Module key={item?.moduleContract.address} module={item} />
        )
      )}
    </div>
  );
};

export default Allowance;
