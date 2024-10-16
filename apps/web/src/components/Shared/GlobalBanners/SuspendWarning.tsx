import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { APP_NAME } from "@hey/data/constants";
import { GridItemEight, GridLayout } from "@hey/ui";
import type { FC } from "react";
import { useProfileStatus } from "src/store/non-persisted/useProfileStatus";

const SuspendWarning: FC = () => {
  const { hasSuspendWarning } = useProfileStatus();

  if (!hasSuspendWarning) {
    return null;
  }

  return (
    <div className="border-gray-300 border-b bg-gray-500/20">
      <GridLayout>
        <GridItemEight className="space-y-1">
          <div className="flex items-center space-x-2 text-gray-700">
            <ExclamationCircleIcon className="size-5" />
            <div className="font-bold text-base sm:text-lg">
              Your profile have a chance of being suspended on {APP_NAME}.
            </div>
          </div>
          <div className="text-gray-500 text-sm">
            Your profile risks suspension due to reports of spammy or bot-like
            posts flagged by Lens gardeners.
          </div>
        </GridItemEight>
      </GridLayout>
    </div>
  );
};

export default SuspendWarning;
