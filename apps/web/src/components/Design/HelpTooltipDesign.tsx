import { Card, CardHeader, HelpTooltip } from "@hey/ui";
import type { FC } from "react";

const HelpTooltipDesign: FC = () => {
  return (
    <Card>
      <CardHeader title="Help Tooltip" />
      <div className="m-5 flex gap-5">
        <HelpTooltip>
          <div>
            This is a tooltip with a <b>custom</b> content
          </div>
        </HelpTooltip>
      </div>
    </Card>
  );
};

export default HelpTooltipDesign;
