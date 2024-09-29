import humanize from "@hey/helpers/humanize";
import type { FC, ReactNode } from "react";
import { Card } from "./Card";
import { H4 } from "./Typography";

interface NumberedStatsProps {
  count: string;
  name: ReactNode;
  suffix?: string;
}

const NumberedStat: FC<NumberedStatsProps> = ({ count, name, suffix }) => {
  return (
    <Card className="p-5" forceRounded>
      <div>{name}</div>
      <H4 className="tracking-wide">
        {humanize(Number(count))} <span className="text-sm">{suffix}</span>
      </H4>
    </Card>
  );
};

export default NumberedStat;
