import 'tippy.js/dist/tippy.css';

import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Tippy from '@tippyjs/react';
import type { FC, ReactNode } from 'react';

interface HelpTooltipProps {
  children: ReactNode;
}

const HelpTooltip: FC<HelpTooltipProps> = ({ children }) => {
  if (!children) {
    return null;
  }

  return (
    <Tippy
      placement="top"
      duration={0}
      className="!rounded-xl p-2.5 !leading-5 tracking-wide shadow-lg"
      content={<span>{children}</span>}
    >
      <span>
        <InformationCircleIcon className="lt-text-gray-500 h-[15px] w-[15px]" />
      </span>
    </Tippy>
  );
};

export default HelpTooltip;
