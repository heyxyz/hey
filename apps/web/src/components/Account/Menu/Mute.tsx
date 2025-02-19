import { MenuItem } from "@headlessui/react";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";
import getAccount from "@hey/helpers/getAccount";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { Account } from "@hey/indexer";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import { useGlobalAlertStateStore } from "src/store/non-persisted/alert/useGlobalAlertStateStore";

interface MuteProps {
  account: Account;
}

const Mute: FC<MuteProps> = ({ account }) => {
  const { setShowMuteOrUnmuteAlert } = useGlobalAlertStateStore();
  const isMutedByMe = account.operations?.isMutedByMe;

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
        setShowMuteOrUnmuteAlert(true, account);
      }}
    >
      {isMutedByMe ? (
        <SpeakerWaveIcon className="size-4" />
      ) : (
        <SpeakerXMarkIcon className="size-4" />
      )}
      <div>
        {isMutedByMe ? "Unmute" : "Mute"}{" "}
        {getAccount(account).usernameWithPrefix}
      </div>
    </MenuItem>
  );
};

export default Mute;
