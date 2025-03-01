import { Errors } from "@hey/data/errors";
import type { AccountFragment, GroupFragment } from "@hey/indexer";
import { Button } from "@hey/ui";
import type { FC } from "react";
import toast from "react-hot-toast";
import { useBanAlertStore } from "src/store/non-persisted/alert/useBanAlertStore";
import { useAuthModalStore } from "src/store/non-persisted/modal/useAuthModalStore";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface BanProps {
  group: GroupFragment;
  account: AccountFragment;
}

const Ban: FC<BanProps> = ({ group, account }) => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const { setShowAuthModal } = useAuthModalStore();
  const { setShowBanOrUnbanAlert } = useBanAlertStore();

  const handleBan = async () => {
    if (!currentAccount) {
      return setShowAuthModal(true);
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
    <Button onClick={handleBan} size="sm" variant="danger">
      Ban
    </Button>
  );
};

export default Ban;
