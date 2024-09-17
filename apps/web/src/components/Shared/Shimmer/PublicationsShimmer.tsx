import type { FC } from "react";

import { Card } from "@hey/ui";

import PublicationShimmer from "./PublicationShimmer";

const PublicationsShimmer: FC = () => {
  return (
    <Card className="divide-y-[1px] dark:divide-gray-700">
      <PublicationShimmer />
      <PublicationShimmer />
      <PublicationShimmer />
    </Card>
  );
};

export default PublicationsShimmer;
