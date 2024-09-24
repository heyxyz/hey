import { Card } from "@hey/ui";
import type { FC } from "react";
import PublicationShimmer from "./PublicationShimmer";

const PublicationsShimmer: FC = () => {
  return (
    <Card className="divide-y-[1px] dark:divide-gray-700">
      {Array.from({ length: 3 }).map((_, index) => (
        <PublicationShimmer key={index} />
      ))}
    </Card>
  );
};

export default PublicationsShimmer;
