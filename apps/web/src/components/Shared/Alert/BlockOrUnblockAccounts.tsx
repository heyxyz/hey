import { useApolloClient } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import getAccount from "@hey/helpers/getAccount";
import selfFundedTransactionData from "@hey/helpers/selfFundedTransactionData";
import sponsoredTransactionData from "@hey/helpers/sponsoredTransactionData";
import {
  type Account,
  type LoggedInAccountOperations,
  useBlockMutation,
  useUnblockMutation
} from "@hey/indexer";
import { OptmisticTransactionType } from "@hey/types/enums";
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

const BlockOrUnblockAccount: FC = () => {
  const { currentAccount } = useAccountStore();
  const {
    blockingorUnblockingAccount,
    setShowBlockOrUnblockAlert,
    showBlockOrUnblockAlert
  } = useGlobalAlertStateStore();
  const { isBlockOrUnblockPending } = useTransactionStore();

  const [isLoading, setIsLoading] = useState(false);
  const [hasBlocked, setHasBlocked] = useState(
    blockingorUnblockingAccount?.operations?.isBlockedByMe
  );
  const { isSuspended } = useAccountStatus();
  const { cache } = useApolloClient();
  const { data: walletClient } = useWalletClient();

  const updateTransactions = ({
    txHash
  }: {
    txHash: string;
  }) => {
    addOptimisticTransaction({
      ...(hasBlocked
        ? { unblockOn: blockingorUnblockingAccount?.address }
        : { blockOn: blockingorUnblockingAccount?.address }),
      txHash,
      type: hasBlocked
        ? OptmisticTransactionType.Unblock
        : OptmisticTransactionType.Block
    });
  };

  const updateCache = () => {
    cache.modify({
      fields: { isBlockedByMe: () => !hasBlocked },
      id: cache.identify(
        blockingorUnblockingAccount?.operations as LoggedInAccountOperations
      )
    });
    cache.evict({ id: cache.identify(blockingorUnblockingAccount as Account) });
  };

  const onCompleted = (hash: string) => {
    updateCache();
    updateTransactions({ txHash: hash });
    setIsLoading(false);
    setHasBlocked(!hasBlocked);
    setShowBlockOrUnblockAlert(false, null);
    toast.success(hasBlocked ? "Unblocked" : "Blocked");
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [block] = useBlockMutation({
    onCompleted: async ({ block }) => {
      if (block.__typename === "BlockResponse") {
        return onCompleted(block.hash);
      }

      if (walletClient) {
        try {
          if (block.__typename === "SponsoredTransactionRequest") {
            const hash = await sendEip712Transaction(walletClient, {
              account: walletClient.account,
              ...sponsoredTransactionData(block.raw)
            });

            return onCompleted(hash);
          }

          if (block.__typename === "SelfFundedTransactionRequest") {
            const hash = await sendTransaction(walletClient, {
              account: walletClient.account,
              ...selfFundedTransactionData(block.raw)
            });

            return onCompleted(hash);
          }
        } catch (error) {
          return onError(error);
        }
      }

      if (block.__typename === "BlockError") {
        return toast.error(block.error);
      }
    },
    onError
  });

  const [unblock] = useUnblockMutation({
    onCompleted: async ({ unblock }) => {
      if (unblock.__typename === "UnblockResponse") {
        return onCompleted(unblock.hash);
      }

      if (walletClient) {
        try {
          if (unblock.__typename === "SponsoredTransactionRequest") {
            const hash = await sendEip712Transaction(walletClient, {
              account: walletClient.account,
              ...sponsoredTransactionData(unblock.raw)
            });

            return onCompleted(hash);
          }

          if (unblock.__typename === "SelfFundedTransactionRequest") {
            const hash = await sendTransaction(walletClient, {
              account: walletClient.account,
              ...selfFundedTransactionData(unblock.raw)
            });

            return onCompleted(hash);
          }
        } catch (error) {
          return onError(error);
        }
      }

      if (unblock.__typename === "UnblockError") {
        return toast.error(unblock.error);
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

      // Unblock
      if (hasBlocked) {
        return await unblock({
          variables: {
            request: { account: blockingorUnblockingAccount?.address }
          }
        });
      }

      // Block
      return await block({
        variables: {
          request: { account: blockingorUnblockingAccount?.address }
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Alert
      confirmText={hasBlocked ? "Unblock" : "Block"}
      description={`Are you sure you want to ${
        hasBlocked ? "un-block" : "block"
      } ${getAccount(blockingorUnblockingAccount).usernameWithPrefix}?`}
      isDestructive
      isPerformingAction={
        isLoading ||
        isBlockOrUnblockPending(blockingorUnblockingAccount?.address)
      }
      onClose={() => setShowBlockOrUnblockAlert(false, null)}
      onConfirm={blockOrUnblock}
      show={showBlockOrUnblockAlert}
      title="Block Account"
    />
  );
};

export default BlockOrUnblockAccount;
