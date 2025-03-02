import { useApolloClient } from "@apollo/client";
import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import { Events } from "@hey/data/events";
import getAccount from "@hey/helpers/getAccount";
import {
  type AccountFragment,
  useBanGroupAccountsMutation,
  useUnbanGroupAccountsMutation
} from "@hey/indexer";
import { Alert } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useBanAlertStore } from "src/store/non-persisted/alert/useBanAlertStore";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const BanOrUnbanAccount: FC = () => {
  const { currentAccount } = useAccountStore();
  const {
    banningOrUnbanningAccount,
    banningGroupAddress,
    banning,
    setShowBanOrUnbanAlert,
    showBanOrUnbanAlert
  } = useBanAlertStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isSuspended } = useAccountStatus();
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = () => {
    cache.evict({
      id: cache.identify(banningOrUnbanningAccount as AccountFragment)
    });
  };

  const onCompleted = () => {
    updateCache();
    setIsSubmitting(false);
    setShowBanOrUnbanAlert(false, banning);
    trackEvent(banning ? Events.Group.Ban : Events.Group.Unban);
    toast.success(banning ? "Banned successfully" : "Unbanned successfully");
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [banGroupAccounts] = useBanGroupAccountsMutation({
    onCompleted: async ({ banGroupAccounts }) => {
      if (banGroupAccounts.__typename === "BanGroupAccountsResponse") {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        transactionData: banGroupAccounts,
        onCompleted,
        onError
      });
    },
    onError
  });

  const [unbanGroupAccounts] = useUnbanGroupAccountsMutation({
    onCompleted: async ({ unbanGroupAccounts }) => {
      if (unbanGroupAccounts.__typename === "UnbanGroupAccountsResponse") {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        transactionData: unbanGroupAccounts,
        onCompleted,
        onError
      });
    },
    onError
  });

  const blockOrUnblock = async () => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsSubmitting(true);

    // Unban
    if (banning) {
      return await banGroupAccounts({
        variables: {
          request: {
            accounts: [banningOrUnbanningAccount?.address],
            group: banningGroupAddress
          }
        }
      });
    }

    // Ban
    return await unbanGroupAccounts({
      variables: {
        request: {
          accounts: [banningOrUnbanningAccount?.address],
          group: banningGroupAddress
        }
      }
    });
  };

  return (
    <Alert
      confirmText={banning ? "Ban" : "Unban"}
      description={`Are you sure you want to ${
        banning ? "ban" : "un-ban"
      } ${getAccount(banningOrUnbanningAccount).usernameWithPrefix}?`}
      isDestructive
      isPerformingAction={isSubmitting}
      onClose={() => setShowBanOrUnbanAlert(false, banning)}
      onConfirm={blockOrUnblock}
      show={showBanOrUnbanAlert}
      title="Ban Account"
    />
  );
};

export default BanOrUnbanAccount;
