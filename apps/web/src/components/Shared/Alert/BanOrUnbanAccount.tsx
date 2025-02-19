import { useApolloClient } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import getAccount from "@hey/helpers/getAccount";
import {
  type Account,
  useBanGroupAccountsMutation,
  useUnbanGroupAccountsMutation
} from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { Alert } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useBanAlertStateStoreStore } from "src/store/non-persialert/useBanAlertStateStorenAlertStateStore";
import { useAccountStatusom "src/store/non-persisted/useAcuseAccountStatus
import { useAccountStore } from "src/store/persisted/useAccountStore";
import {
  addOptimisticTransaction,
  useTransactionStore
} from "src/store/persisted/useTransactionStore";

const BanOrUnbanAccount: FC = () => {
  const { currentAccount } = useAccountStore();
  const {
    banningOrUnbanningAccount,
    banningGroupAddress,
    banning,
    setShowBanOrUnbanAlert,
    showBanOrUnbanAlert
  } = useBanAlertStateStore();
  const { isBlockOrUnblockPending } = useTransactionStore();
  const [isLoading, setIsLoading] = useState(false);
  const { isSuspended } = useAccountStatus();
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = () => {
    cache.evict({ id: cache.identify(banningOrUnbanningAccount as Account) });
  };

  const onCompleted = (hash: string) => {
    addOptimisticTransaction({
      ...(banning
        ? { banOn: banningOrUnbanningAccount?.address }
        : { unbanOn: banningOrUnbanningAccount?.address }),
      txHash: hash,
      type: banning
        ? OptimisticTxType.BAN_GROUP_ACCOUNT
        : OptimisticTxType.UNBAN_GROUP_ACCOUNT
    });

    updateCache();
    setIsLoading(false);
    setShowBanOrUnbanAlert(false, banning, null, null);
    toast.success(banning ? "Banned successfully" : "Unbanned successfully");
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [banGroupAccounts] = useBanGroupAccountsMutation({
    onCompleted: async ({ banGroupAccounts }) => {
      if (banGroupAccounts.__typename === "BanGroupAccountsResponse") {
        return onCompleted(banGroupAccounts.hash);
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
        return onCompleted(unbanGroupAccounts.hash);
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

    try {
      setIsLoading(true);

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
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Alert
      confirmText={banning ? "Ban" : "Unban"}
      description={`Are you sure you want to ${
        banning ? "ban" : "un-ban"
      } ${getAccount(banningOrUnbanningAccount).usernameWithPrefix}?`}
      isDestructive
      isPerformingAction={
        isLoading || isBlockOrUnblockPending(banningOrUnbanningAccount?.address)
      }
      onClose={() => setShowBanOrUnbanAlert(false, banning, null, null)}
      onConfirm={blockOrUnblock}
      show={showBanOrUnbanAlert}
      title="Ban Account"
    />
  );
};

export default BanOrUnbanAccount;
