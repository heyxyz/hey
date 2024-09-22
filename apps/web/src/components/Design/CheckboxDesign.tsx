import { Card, CardHeader, Checkbox } from "@hey/ui";
import type { FC } from "react";

const CheckboxDesign: FC = () => {
  return (
    <Card>
      <CardHeader title="Checkbox" />
      <div className="m-5 flex flex-col items-start gap-5">
        <Checkbox checked={true} label="Checked" />
        <Checkbox label="Unchecked" />
        <Checkbox disabled checked={true} label="Checked Disabled" />
        <Checkbox disabled label="Unchecked Disabled" />
      </div>
    </Card>
  );
};

export default CheckboxDesign;
