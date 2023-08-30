import type {
  ApprovedAllowanceAmount,
  ApprovedModuleAllowanceAmountQuery
} from '@lenster/lens';
import { CollectModules } from '@lenster/lens';
import { For } from 'million/react';
import type { FC } from 'react';

import Module from './Module';

interface AllowanceProps {
  allowance: ApprovedModuleAllowanceAmountQuery | undefined;
}

const Allowance: FC<AllowanceProps> = ({ allowance }) => {
  const filteredAllowances = allowance?.approvedModuleAllowanceAmount.filter(
    (item) => item?.module !== CollectModules.RevertCollectModule
  );
  return (
    <div className="space-y-4 p-5">
      {filteredAllowances ? (
        <For each={filteredAllowances}>
          {(item: ApprovedAllowanceAmount) => (
            <Module key={item?.contractAddress} module={item} />
          )}
        </For>
      ) : null}
    </div>
  );
};

export default Allowance;
