import type { FC } from "react";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Card } from "@hey/ui";

import PublicationShimmer from "./PublicationShimmer";

const PublicationListShimmer: FC = () => {
  return (
    <Card className="divide-y dark:divide-gray-700">
      <div className="flex items-center space-x-3 px-5 py-6">
        <ArrowLeftIcon className="size-5" />
        <div className="shimmer h-4 w-1/5 rounded-full" />
      </div>
      <PublicationShimmer />
      <PublicationShimmer />
      <PublicationShimmer />
    </Card>
  );
};

export default PublicationListShimmer;
