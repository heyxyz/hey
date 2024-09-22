import { Badge, Card, CardHeader } from "@hey/ui";
import type { FC } from "react";

const BadgeDesign: FC = () => {
  return (
    <Card>
      <CardHeader title="Badge" />
      <div className="m-5 flex items-center gap-5">
        <Badge variant="brand">Brand Badge</Badge>
        <Badge variant="primary">Primary Badge</Badge>
        <Badge variant="secondary">Secondary Badge</Badge>
        <Badge variant="warning">Warning Badge</Badge>
        <Badge variant="danger">Danger Badge</Badge>
        <Badge variant="brand" size="md">
          Medium Badge
        </Badge>
        <Badge variant="brand" size="lg">
          Large Badge
        </Badge>
      </div>
    </Card>
  );
};

export default BadgeDesign;
