import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { Errors } from "@hey/data/errors";
import type { Account, Group } from "@hey/indexer";
import { Tooltip } from "@hey/ui";
import type { FC } from "react";
import toast from "react-hot-toast";
import { useBanAlertStore } from "src/store/non-persisted/alert/useBanAlertStore";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useGlobalModalStore } from "src/store/non-persisted/useGlobalModalStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface BanProps {
  group: Group;
  account: Account;
}

const Ban: FC<BanProps> = ({ group, account }) => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const { setShowAuthModal } = useGlobalModalStore();
  const { setShowBanOrUnbanAlert } = useBanAlertStore();

  const handleBan = async () => {
    if (!currentAccount) {
      setShowAuthModal(true);
      return;
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    return setShowBanOrUnbanAlert(true, true, account, group.address);
  };

  if (group.owner !== currentAccount?.address) {
    return null;
  }

  if (group.owner === account.address) {
    return null;
  }

  return (
    <Tooltip content="Ban" placement="top">
      <button onClick={handleBan} type="button">
        <NoSymbolIcon className="size-4 text-red-500" />
      </button>
    </Tooltip>
  );
};

export default Ban;
