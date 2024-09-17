import type { FC, ReactNode } from "react";

import { InformationCircleIcon } from "@heroicons/react/24/outline";

import { Tooltip } from "./Tooltip";

interface HelpTooltipProps {
  children: ReactNode;
}

const HelpTooltip: FC<HelpTooltipProps> = ({ children }) => {
  if (!children) {
    return null;
  }

  return (
    <span className="cursor-pointer">
      <Tooltip content={<span>{children}</span>} placement="top">
        <InformationCircleIcon className="ld-text-gray-500 size-[15px]" />
      </Tooltip>
    </span>
  );
};

export default HelpTooltip;
