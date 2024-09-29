import { Card, CardHeader, Select } from "@hey/ui";
import type { FC } from "react";

const SelectDesign: FC = () => {
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
      <CardHeader title="Select" />
      <div className="m-5 flex flex-col items-start gap-5">
        <div className="w-2/6">
          <div className="label">Simple Select</div>
          <Select onChange={() => {}} options={options} />
        </div>
        <div className="w-2/6">
          <div className="label">Select with Search</div>
          <Select onChange={() => {}} options={options} showSearch />
        </div>
        <div className="w-2/6">
          <div className="label">Select with Icon</div>
          <Select
            onChange={() => {}}
            options={optionsWithIcon}
            iconClassName="size-4"
          />
        </div>
      </div>
    </Card>
  );
};

export default SelectDesign;
