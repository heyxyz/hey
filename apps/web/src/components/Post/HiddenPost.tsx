import { Card } from "@hey/ui";
import type { FC } from "react";

interface HiddenPostProps {
  type?: string;
}

const HiddenPost: FC<HiddenPostProps> = ({ type = "Post" }) => {
  return (
    <Card className="!bg-gray-100 dark:!bg-gray-800 mt-2" forceRounded>
      <div className="px-4 py-3 text-sm">{type} was hidden by the author</div>
    </Card>
  );
};

export default HiddenPost;
