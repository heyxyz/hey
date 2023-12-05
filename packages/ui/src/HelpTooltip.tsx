import type { FC, ReactNode } from 'react';

import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface HelpTooltipProps {
  children: ReactNode;
}

const HelpTooltip: FC<HelpTooltipProps> = ({ children }) => {
  if (!children) {
    return null;
  }

  return (
    <Tippy
      className="!rounded-xl p-2.5 !leading-5 tracking-wide shadow-lg"
      content={<span>{children}</span>}
      duration={0}
      placement="top"
    >
      <span>
        <InformationCircleIcon className="ld-text-gray-500 h-[15px] w-[15px]" />
      </span>
    </Tippy>
  );
};

export default HelpTooltip;
