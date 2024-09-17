import type { FC } from "react";

import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { APP_NAME } from "@hey/data/constants";
import { GridItemEight, GridLayout } from "@hey/ui";
import Link from "next/link";
import { useProfileStatus } from "src/store/non-persisted/useProfileStatus";

const Suspended: FC = () => {
  const { isSuspended } = useProfileStatus();

  if (!isSuspended) {
    return null;
  }

  return (
    <div className="border-gray-300 border-b bg-gray-500/20">
      <GridLayout>
        <GridItemEight className="space-y-1">
          <div className="flex items-center space-x-2 text-gray-700">
            <NoSymbolIcon className="size-5" />
            <div className="font-bold text-base sm:text-lg">
              Your profile has been suspended by {APP_NAME}.
            </div>
          </div>
          <div className="text-gray-500 text-sm">
            Because of that, your profile may limit your ability to interact
            with {APP_NAME} and other users.{" "}
            <Link href="/support">Contact us</Link> if you think this is a
            mistake.
          </div>
        </GridItemEight>
      </GridLayout>
    </div>
  );
};

export default Suspended;
