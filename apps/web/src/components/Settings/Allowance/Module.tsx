import { Card } from '@components/UI/Card';
import HelpTooltip from '@components/UI/HelpTooltip';
import GetModuleIcon from '@components/utils/GetModuleIcon';
import { getModule } from '@lib/getModule';
import { POLYGONSCAN_URL } from 'data/constants';
import type { ApprovedAllowanceAmount } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';

import AllowanceButton from './Button';

interface Props {
  module: ApprovedAllowanceAmount;
}

const Module: FC<Props> = ({ module }) => {
  const [allowed, setAllowed] = useState(module?.allowance !== '0x00');

  return (
    <Card key={module?.module} className="block items-center justify-between p-5 sm:flex" forceRounded>
      <div className="mr-1.5 mb-3 overflow-hidden sm:mb-0">
        <div className="flex items-center space-x-2">
          <div className="text-brand">
            <GetModuleIcon module={module?.module} size={4} />
          </div>
          <div className="whitespace-nowrap font-bold">{getModule(module?.module).name}</div>
          <HelpTooltip content={getModule(module?.module).helper} />
        </div>
        <a
          href={`${POLYGONSCAN_URL}/address/${module?.contractAddress}`}
          className="lt-text-gray-500 truncate text-sm"
          target="_blank"
          rel="noreferrer noopener"
        >
          {module?.contractAddress}
        </a>
      </div>
      <AllowanceButton module={module} allowed={allowed} setAllowed={setAllowed} />
    </Card>
  );
};

export default Module;
