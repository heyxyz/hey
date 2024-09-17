import { Card, CardHeader, H1, H2, H3, H4, H5, H6 } from "@hey/ui";
import type { FC } from "react";

const TypographyDesign: FC = () => {
  const title = "The quick brown fox jumps over the lazy dog";

  return (
    <Card>
      <CardHeader title="Typography" />
      <div className="m-5 space-y-5">
        <H1>{title}</H1>
        <H2>{title}</H2>
        <H3>{title}</H3>
        <H4>{title}</H4>
        <H5>{title}</H5>
        <H6>{title}</H6>
        <p>{title}</p>
      </div>
    </Card>
  );
};

export default TypographyDesign;
