import { Card, CardHeader, NumberedStat } from "@hey/ui";
import type { FC } from "react";

const NumberedStatDesign: FC = () => {
  return (
    <Card>
      <CardHeader title="Numbered Stat" />
      <div className="m-5 flex flex-col items-start gap-5">
        <NumberedStat count="69" name="Stat Name" />
        <NumberedStat count="69" name="Stat Name" suffix="Suffix" />
      </div>
    </Card>
  );
};

export default NumberedStatDesign;
