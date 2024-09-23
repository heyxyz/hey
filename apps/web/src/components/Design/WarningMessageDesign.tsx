import { Card, CardHeader, WarningMessage } from "@hey/ui";
import type { FC } from "react";

const WarningMessageDesign: FC = () => {
  return (
    <Card>
      <CardHeader title="Warning Message" />
      <div className="m-5 flex items-center gap-5">
        <WarningMessage title="Title" message="Simple warning message" />
        <WarningMessage
          title="Title"
          message="Warning message with custom class"
          className="rounded-none"
        />
      </div>
    </Card>
  );
};

export default WarningMessageDesign;
