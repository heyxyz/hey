import { FaceSmileIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, EmptyState } from "@hey/ui";
import type { FC } from "react";

const EmptyStateDesign: FC = () => {
  return (
    <Card>
      <CardHeader title="Empty State" />
      <div className="m-5 flex flex-col items-start gap-5">
        <EmptyState
          icon={<FaceSmileIcon className="size-8" />}
          message="Simple empty state"
        />
        <EmptyState
          icon={<FaceSmileIcon className="size-8" />}
          message="Empty state without card"
          hideCard
        />
      </div>
    </Card>
  );
};

export default EmptyStateDesign;
