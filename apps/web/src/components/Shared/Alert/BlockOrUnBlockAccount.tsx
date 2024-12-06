import { useApolloClient } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import getAccount from "@hey/helpers/getAccount";
import selfFundedTransactionData from "@hey/helpers/selfFundedTransactionData";
import sponsoredTransactionData from "@hey/helpers/sponsoredTransactionData";
import { useBlockMutation, useUnblockMutation } from "@hey/indexer";
import { OptmisticPostType } from "@hey/types/enums";
import type { OptimisticTransaction } from "@hey/types/misc";
import { Alert } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useGlobalAlertStateStore } from "src/store/non-persisted/useGlobalAlertStateStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";

const BlockOrUnBlockAccount: FC = () => {
  const { currentAccount } = useAccountStore();
  const {
    blockingorUnblockingProfile,
    setShowBlockOrUnblockAlert,
    showBlockOrUnblockAlert
  } = useGlobalAlertStateStore();
  const { addTransaction, isBlockOrUnblockPending } = useTransactionStore();

  const [isLoading, setIsLoading] = useState(false);
  const [hasBlocked, setHasBlocked] = useState(
    blockingorUnblockingProfile?.operations?.isBlockedByMe
  );
  const { isSuspended } = useAccountStatus();
  const { cache } = useApolloClient();
  const { data: walletClient } = useWalletClient();

  const generateOptimisticBlockOrUnblock = ({
    txHash
  }: {
    txHash: string;
  }): OptimisticTransaction => {
    return {
      blockOrUnblockOn: blockingorUnblockingProfile?.address,
      txHash,
      type: hasBlocked ? OptmisticPostType.Unblock : OptmisticPostType.Block
    };
  };

  const updateCache = () => {
    cache.modify({
      fields: { isBlockedByMe: () => !hasBlocked },
      id: `ProfileOperations:${blockingorUnblockingProfile?.address}`
    });
    cache.evict({ id: `Profile:${blockingorUnblockingProfile?.address}` });
  };

  const onCompleted = (hash: string) => {
    updateCache();
    addTransaction(generateOptimisticBlockOrUnblock({ txHash: hash }));
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
            request: { account: blockingorUnblockingProfile?.address }
          }
        });
      }

      // Block
      return await block({
        variables: {
          request: { account: blockingorUnblockingProfile?.address }
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
      } ${getAccount(blockingorUnblockingProfile).slugWithPrefix}?`}
      isDestructive
      isPerformingAction={
        isLoading ||
        isBlockOrUnblockPending(blockingorUnblockingProfile?.address)
      }
      onClose={() => setShowBlockOrUnblockAlert(false, null)}
      onConfirm={blockOrUnblock}
      show={showBlockOrUnblockAlert}
      title="Block Account"
    />
  );
};

export default BlockOrUnBlockAccount;
