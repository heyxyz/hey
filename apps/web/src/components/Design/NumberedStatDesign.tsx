import { Card, CardHeader, NumberedStat } from "@hey/ui";
import type { FC } from "react";

const NumberedStatDesign: FC = () => {
  const options = [
    {
      htmlLabel: "Simple Label",
      label: "Simple Label",
      value: "simple-label",
      selected: true
    },
    { htmlLabel: <b>HTML Label</b>, label: "HTML Label", value: "html-label" }
  ];

  const optionsWithIcon = [
    {
      label: "Option 1",
      value: "1",
      icon: "https://hey-assets.b-cdn.net/images/app-icon/0.png",
      selected: true
    },
    {
      label: "Option 2",
      value: "2",
      icon: "https://hey-assets.b-cdn.net/images/app-icon/2.png"
    },
    {
      label: "Option 3",
      value: "3",
      icon: "https://hey-assets.b-cdn.net/images/app-icon/3.png"
    },
    {
      label: "Option 4",
      value: "4",
      icon: "https://hey-assets.b-cdn.net/images/app-icon/4.png"
    }
  ];

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
