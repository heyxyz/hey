import { Card, CardHeader } from "@hey/ui";
import type { FC } from "react";

const CardDesign: FC = () => {
  return (
    <Card>
      <CardHeader title="Card" />
      <div className="m-5 flex flex-col items-start gap-5">
        <Card>Card without padding</Card>
        <Card className="p-5">Card body</Card>
        <Card className="p-5" forceRounded>
          Card force rounded (on mobile)
        </Card>
        <Card>
          <CardHeader title="Card Header" />
          <div className="p-5">Card body</div>
        </Card>
      </div>
    </Card>
  );
};

export default CardDesign;
