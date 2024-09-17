import { Card, CardHeader, Spinner } from "@hey/ui";
import type { FC } from "react";

const SpinnerDesign: FC = () => {
  return (
    <Card>
      <CardHeader title="Spinner" />
      <div className="m-5 flex items-center gap-5">
        <Spinner size="xs" />
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
        <Spinner size="lg" variant="primary" />
        <Spinner size="lg" variant="warning" />
        <Spinner size="lg" variant="danger" />
      </div>
    </Card>
  );
};

export default SpinnerDesign;
