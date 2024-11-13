import { ChartBarIcon } from "@heroicons/react/24/outline";
import humanize from "@hey/helpers/humanize";
import nFormatter from "@hey/helpers/nFormatter";
import { Tooltip } from "@hey/ui";
import type { FC } from "react";

interface ViewsProps {
  showCount: boolean;
  views: number;
}

const Views: FC<ViewsProps> = ({ showCount, views }) => {
  if (showCount) {
    return null;
  }

  return (
    <div className="ld-text-gray-500 flex items-center space-x-1">
      <button
        aria-label="Views"
        className="rounded-full p-1.5 outline-offset-2 hover:bg-gray-300/20"
        disabled
        type="button"
      >
        <Tooltip content={`${humanize(views)} Views`} placement="top" withDelay>
          <ChartBarIcon className="w-[15px] sm:w-[18px]" />
        </Tooltip>
      </button>
      <span className="text-[11px] sm:text-xs">{nFormatter(views)}</span>
    </div>
  );
};

export default Views;
