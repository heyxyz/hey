import { MenuItem } from "@headlessui/react";
import { FlagIcon } from "@heroicons/react/24/outline";
import type { Account } from "@hey/indexer";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";

interface ReportProfileProps {
  account: Account;
}

const Report: FC<ReportProfileProps> = ({ account }) => {
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
      onClick={() => setShowReportProfileModal(true, account)}
    >
      <FlagIcon className="size-4" />
      <div>Report account</div>
    </MenuItem>
  );
};

export default Report;
