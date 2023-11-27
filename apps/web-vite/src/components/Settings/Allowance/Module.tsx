import { POLYGONSCAN_URL } from '@hey/data/constants';
import type { ApprovedAllowanceAmountResult } from '@hey/lens';
import { Card } from '@hey/ui';
import getAllowanceModule from '@lib/getAllowanceModule';
import { Link } from 'react-router-dom';
import type { FC } from 'react';
import { useState } from 'react';

import AllowanceButton from './Button';

interface ModuleProps {
  module: ApprovedAllowanceAmountResult;
}

const Module: FC<ModuleProps> = ({ module }) => {
  const [allowed, setAllowed] = useState(
    parseFloat(module?.allowance.value) > 0
  );

  return (
    <Card
      key={module?.moduleName}
      className="block items-center justify-between p-5 sm:flex"
      forceRounded
    >
      <div className="mb-3 mr-1.5 overflow-hidden sm:mb-0">
        <div className="whitespace-nowrap font-bold">
          {getAllowanceModule(module?.moduleName).name}
        </div>
        <Link
          to={`${POLYGONSCAN_URL}/address/${module?.moduleContract.address}`}
          className="ld-text-gray-500 truncate text-sm"
          target="_blank"
          rel="noreferrer noopener"
        >
          {module?.moduleContract.address}
        </Link>
      </div>
      <AllowanceButton
        module={module}
        allowed={allowed}
        setAllowed={setAllowed}
      />
    </Card>
  );
};

export default Module;
