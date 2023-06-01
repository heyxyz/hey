import type { ApprovedAllowanceAmount } from '@lenster/lens';
import getAllowanceModule from '@lib/getAllowanceModule';
import { POLYGONSCAN_URL } from 'data/constants';
import Link from 'next/link';
import type { FC } from 'react';
import { useState } from 'react';
import { Card } from 'ui';

import AllowanceButton from './Button';

interface ModuleProps {
  module: ApprovedAllowanceAmount;
}

const Module: FC<ModuleProps> = ({ module }) => {
  const [allowed, setAllowed] = useState(module?.allowance !== '0x00');

  return (
    <Card
      key={module?.module}
      className="block items-center justify-between p-5 sm:flex"
      forceRounded
    >
      <div className="mb-3 mr-1.5 overflow-hidden sm:mb-0">
        <div className="whitespace-nowrap font-bold">
          {getAllowanceModule(module?.module).name}
        </div>
        <Link
          href={`${POLYGONSCAN_URL}/address/${module?.contractAddress}`}
          className="lt-text-gray-500 truncate text-sm"
          target="_blank"
          rel="noreferrer noopener"
        >
          {module?.contractAddress}
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
