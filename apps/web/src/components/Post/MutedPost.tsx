import { Leafwatch } from "@helpers/leafwatch";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { POST } from "@hey/data/tracking";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import { Button, Card } from "@hey/ui";
import type { FC } from "react";

interface MutedPostProps {
  type?: string;
  setShowMutedPublication: (show: boolean) => void;
}

const MutedPost: FC<MutedPostProps> = ({
  type = "Publication",
  setShowMutedPublication
}) => {
  return (
    <Card className="!bg-gray-100 dark:!bg-gray-800 mt-2 flex items-center justify-between px-4 py-3">
      <div className="flex items-center space-x-1 text-sm">
        <EyeSlashIcon className="size-4 text-gray-500" />
        <span>{type} hidden by a muted word</span>
      </div>
      <Button
        size="sm"
        onClick={(event) => {
          stopEventPropagation(event);
          setShowMutedPublication(true);
          Leafwatch.track(POST.TOGGLE_MUTED_PUBLICATION);
        }}
        outline
      >
        Show
      </Button>
    </Card>
  );
};

export default MutedPost;
