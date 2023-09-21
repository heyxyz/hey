import { POLYGONSCAN_URL } from '@lenster/data/constants';
import type { ApprovedAllowanceAmountResult } from '@lenster/lens';
import { Card } from '@lenster/ui';
import getAllowanceModule from '@lib/getAllowanceModule';
import Link from 'next/link';
import type { FC } from 'react';
import { useState } from 'react';

import AllowanceButton from './Button';

interface ModuleProps {
  module: ApprovedAllowanceAmountResult;
}

const Module: FC<ModuleProps> = ({ module }) => {
  const [allowed, setAllowed] = useState(module?.allowance.value !== '0x00');

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
          href={`${POLYGONSCAN_URL}/address/${module?.moduleContract.address}`}
          className="lt-text-gray-500 truncate text-sm"
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
