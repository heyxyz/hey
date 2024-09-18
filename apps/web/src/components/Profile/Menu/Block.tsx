import { MenuItem } from "@headlessui/react";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import getProfile from "@hey/helpers/getProfile";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { Profile } from "@hey/lens";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import { useGlobalAlertStateStore } from "src/store/non-persisted/useGlobalAlertStateStore";

interface BlockProps {
  profile: Profile;
}

const Block: FC<BlockProps> = ({ profile }) => {
  const { setShowBlockOrUnblockAlert } = useGlobalAlertStateStore();
  const isBlockedByMe = profile.operations.isBlockedByMe.value;

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
        setShowBlockOrUnblockAlert(true, profile);
      }}
    >
      <NoSymbolIcon className="size-4" />
      <div>
        {isBlockedByMe ? "Unblock" : "Block"}{" "}
        {getProfile(profile).slugWithPrefix}
      </div>
    </MenuItem>
  );
};

export default Block;
