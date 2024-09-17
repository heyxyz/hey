import type { FC, ReactNode } from "react";

import humanize from "@hey/helpers/humanize";

import { Card } from "./Card";
import { H4 } from "./Typography";

interface NumberedStatsProps {
  action?: ReactNode;
  count: string;
  name: ReactNode;
  suffix?: string;
}

const NumberedStat: FC<NumberedStatsProps> = ({
  action,
  count,
  name,
  suffix
}) => {
  return (
    <Card className="p-5" forceRounded>
      <div className="flex items-center space-x-5">
        <div>{name}</div>
        {action && <div>{action}</div>}
      </div>
      <H4 className="tracking-wide">
        {humanize(Number(count))} <span className="text-sm">{suffix}</span>
      </H4>
    </Card>
  );
};

export default NumberedStat;
