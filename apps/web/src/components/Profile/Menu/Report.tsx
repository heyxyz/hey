import type { Profile } from "@hey/lens";
import type { FC } from "react";

import { MenuItem } from "@headlessui/react";
import { FlagIcon } from "@heroicons/react/24/outline";
import cn from "@hey/ui/cn";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";

interface ReportProfileProps {
  profile: Profile;
}

const Report: FC<ReportProfileProps> = ({ profile }) => {
  const { setShowReportProfileModal } = useGlobalModalStateStore();

  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 flex cursor-pointer items-center space-x-2 rounded-lg px-2 py-1.5 text-sm"
        )
      }
      onClick={() => setShowReportProfileModal(true, profile)}
    >
      <FlagIcon className="size-4" />
      <div>Report profile</div>
    </MenuItem>
  );
};

export default Report;
