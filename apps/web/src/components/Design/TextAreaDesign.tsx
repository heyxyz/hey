import { Card, CardHeader, TextArea } from "@hey/ui";
import type { FC } from "react";

const TextAreaDesign: FC = () => {
  return (
    <Card>
      <CardHeader title="Text Area" />
      <div className="m-5 flex flex-col items-start gap-5">
        <TextArea placeholder="Simple TextArea" />
        <TextArea placeholder="TextArea with bigger rows" rows={5} />
        <TextArea placeholder="TextArea with Label" label="Label" />
      </div>
    </Card>
  );
};

export default TextAreaDesign;
