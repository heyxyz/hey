import type { FC } from "react";

import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { Card, H6 } from "@hey/ui";

const CommentSuspendedWarning: FC = () => {
  return (
    <Card className="!bg-red-100 flex items-center space-x-1.5 border-red-300 p-5 text-gray-500">
      <NoSymbolIcon className="size-4 text-red-500" />
      <H6>You are suspended from commenting</H6>
    </Card>
  );
};

export default CommentSuspendedWarning;
