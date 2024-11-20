import { MenuItem } from "@headlessui/react";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import getAccount from "@hey/helpers/getAccount";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { Profile } from "@hey/lens";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import { useGlobalAlertStateStore } from "src/store/non-persisted/useGlobalAlertStateStore";

interface BlockProps {
  account: Profile;
}

const Block: FC<BlockProps> = ({ account }) => {
  const { setShowBlockOrUnblockAlert } = useGlobalAlertStateStore();
  const isBlockedByMe = account.operations.isBlockedByMe.value;

  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 flex cursor-pointer items-center space-x-2 rounded-lg px-2 py-1.5 text-sm"
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        setShowBlockOrUnblockAlert(true, account);
      }}
    >
      <NoSymbolIcon className="size-4" />
      <div>
        {isBlockedByMe ? "Unblock" : "Block"}{" "}
        {getAccount(account).slugWithPrefix}
      </div>
    </MenuItem>
  );
};

export default Block;
