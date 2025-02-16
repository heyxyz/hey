import { useApolloClient } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import getAccount from "@hey/helpers/getAccount";
import selfFundedTransactionData from "@hey/helpers/selfFundedTransactionData";
import sponsoredTransactionData from "@hey/helpers/sponsoredTransactionData";
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
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useGlobalAlertStateStore } from "src/store/non-persisted/useGlobalAlertStateStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import {
  addOptimisticTransaction,
  useTransactionStore
} from "src/store/persisted/useTransactionStore";
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";

const BanOrUnbanAccount: FC = () => {
  const { currentAccount } = useAccountStore();
  const {
    banningOrUnbanningAccount,
    banningGroupAddress,
    banning,
    setShowBanOrUnbanAlert,
    showBanOrUnbanAlert
  } = useGlobalAlertStateStore();
  const { isBlockOrUnblockPending } = useTransactionStore();

  const [isLoading, setIsLoading] = useState(false);
  const { isSuspended } = useAccountStatus();
  const { cache } = useApolloClient();
  const { data: walletClient } = useWalletClient();

  const updateTransactions = ({
    txHash
  }: {
    txHash: string;
  }) => {
    addOptimisticTransaction({
      ...(banning
        ? { banOn: banningOrUnbanningAccount?.address }
        : { unbanOn: banningOrUnbanningAccount?.address }),
      txHash,
      type: banning
        ? OptimisticTxType.BAN_GROUP_ACCOUNT
        : OptimisticTxType.UNBAN_GROUP_ACCOUNT
    });
  };

  const updateCache = () => {
    cache.evict({ id: cache.identify(banningOrUnbanningAccount as Account) });
  };

  const onCompleted = (hash: string) => {
    updateCache();
    updateTransactions({ txHash: hash });
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

      if (walletClient) {
        try {
          if (banGroupAccounts.__typename === "SponsoredTransactionRequest") {
            const hash = await sendEip712Transaction(walletClient, {
              account: walletClient.account,
              ...sponsoredTransactionData(banGroupAccounts.raw)
            });

            return onCompleted(hash);
          }

          if (banGroupAccounts.__typename === "SelfFundedTransactionRequest") {
            const hash = await sendTransaction(walletClient, {
              account: walletClient.account,
              ...selfFundedTransactionData(banGroupAccounts.raw)
            });

            return onCompleted(hash);
          }

          if (banGroupAccounts.__typename === "TransactionWillFail") {
            return onError({ message: banGroupAccounts.reason });
          }
        } catch (error) {
          return onError(error);
        }
      }
    },
    onError
  });

  const [unbanGroupAccounts] = useUnbanGroupAccountsMutation({
    onCompleted: async ({ unbanGroupAccounts }) => {
      if (unbanGroupAccounts.__typename === "UnbanGroupAccountsResponse") {
        return onCompleted(unbanGroupAccounts.hash);
      }

      if (walletClient) {
        try {
          if (unbanGroupAccounts.__typename === "SponsoredTransactionRequest") {
            const hash = await sendEip712Transaction(walletClient, {
              account: walletClient.account,
              ...sponsoredTransactionData(unbanGroupAccounts.raw)
            });

            return onCompleted(hash);
          }

          if (
            unbanGroupAccounts.__typename === "SelfFundedTransactionRequest"
          ) {
            const hash = await sendTransaction(walletClient, {
              account: walletClient.account,
              ...selfFundedTransactionData(unbanGroupAccounts.raw)
            });

            return onCompleted(hash);
          }

          if (unbanGroupAccounts.__typename === "TransactionWillFail") {
            return onError({ message: unbanGroupAccounts.reason });
          }
        } catch (error) {
          return onError(error);
        }
      }
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
