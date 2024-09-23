import { FaceSmileIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, Input } from "@hey/ui";
import type { FC } from "react";

const InputDesign: FC = () => {
  return (
    <Card>
      <CardHeader title="Input" />
      <div className="m-5 flex flex-col items-start gap-5">
        <Input placeholder="Simple Input" />
        <Input
          placeholder="Input with Icon Left"
          iconLeft={<FaceSmileIcon />}
        />
        <Input
          placeholder="Input with Icon Right"
          iconRight={<FaceSmileIcon />}
        />
        <Input placeholder="Input with Label" label="Label" />
        <Input
          placeholder="Input with Helper on Label"
          label="Label"
          helper="Helper"
        />
        <Input placeholder="Error Input" error />
      </div>
    </Card>
  );
};

export default InputDesign;
