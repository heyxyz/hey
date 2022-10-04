import { ApprovedAllowanceAmount } from '@generated/types';
import { FC } from 'react';

import Module from './Module';

interface Props {
  allowance: any;
}

const Allowance: FC<Props> = ({ allowance }) => {
  return (
    <div className="space-y-4 p-5">
      {allowance?.approvedModuleAllowanceAmount?.map((item: ApprovedAllowanceAmount) =>
        item?.module === 'RevertCollectModule' || item?.module === 'FreeCollectModule' ? (
          ''
        ) : (
          <Module key={item?.contractAddress} module={item} />
        )
      )}
    </div>
  );
};

export default Allowance;
