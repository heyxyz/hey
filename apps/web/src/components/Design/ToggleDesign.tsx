import { Card, CardHeader, Toggle } from "@hey/ui";
import { type FC, useState } from "react";

const ToggleDesign: FC = () => {
  const [on, setOn] = useState(false);

  return (
    <Card>
      <CardHeader title="Toggle" />
      <div className="m-5 flex gap-5">
        <Toggle on={on} setOn={setOn} />
        <Toggle disabled on setOn={() => {}} />
      </div>
    </Card>
  );
};

export default ToggleDesign;
