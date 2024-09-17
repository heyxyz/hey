import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Tooltip } from "@hey/ui";
import type { FC } from "react";

const TooltipDesign: FC = () => {
  const content = "Tooltip content";

  return (
    <Card>
      <CardHeader title="Tooltip" />
      <div className="m-5 flex gap-5">
        <Tooltip className="cursor-pointer" content={content} placement="top">
          Top tooltip
        </Tooltip>
        <Tooltip
          className="cursor-pointer"
          content={content}
          placement="bottom"
        >
          Bottom tooltip
        </Tooltip>
        <Tooltip className="cursor-pointer" content={content} placement="left">
          Left tooltip
        </Tooltip>
        <Tooltip className="cursor-pointer" content={content} placement="right">
          Right tooltip
        </Tooltip>
        <Tooltip
          className="cursor-pointer"
          content={
            <div className="flex items-center space-x-2">
              <div>Tooltip content</div>
              <CheckBadgeIcon className="size-4 text-brand-400" />
            </div>
          }
          placement="top"
        >
          HTML tooltip
        </Tooltip>
      </div>
    </Card>
  );
};

export default TooltipDesign;
