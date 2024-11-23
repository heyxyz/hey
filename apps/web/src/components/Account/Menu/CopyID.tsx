import { MenuItem } from "@headlessui/react";
import { Leafwatch } from "@helpers/leafwatch";
import { HashtagIcon } from "@heroicons/react/24/outline";
import { ACCOUNT } from "@hey/data/tracking";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import toast from "react-hot-toast";
import { usePreferencesStore } from "src/store/persisted/usePreferencesStore";

interface CopyIDProps {
  id: string;
}

const CopyID: FC<CopyIDProps> = ({ id }) => {
  const { developerMode } = usePreferencesStore();

  if (!developerMode) {
    return null;
  }

  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 flex cursor-pointer items-center space-x-2 rounded-lg px-2 py-1.5 text-sm"
        )
      }
      onClick={async (event) => {
        stopEventPropagation(event);
        await navigator.clipboard.writeText(id);
        toast.success("ID copied to clipboard!");
        Leafwatch.track(ACCOUNT.COPY_ACCOUNT_ID, { accountId: id });
      }}
    >
      <HashtagIcon className="size-4" />
      <div>Copy ID</div>
    </MenuItem>
  );
};

export default CopyID;
