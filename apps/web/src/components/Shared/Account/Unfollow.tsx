import { useApolloClient } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import selfFundedTransactionData from "@hey/helpers/selfFundedTransactionData";
import sponsoredTransactionData from "@hey/helpers/sponsoredTransactionData";
import {
  type Account,
  type LoggedInAccountOperations,
  useUnfollowMutation
} from "@hey/indexer";
import { OptmisticTransactionType } from "@hey/types/enums";
import { Button } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import {
  addOptimisticTransaction,
  useTransactionStore
} from "src/store/persisted/useTransactionStore";
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";

interface UnfollowProps {
  buttonClassName: string;
  account: Account;
  small: boolean;
  title: string;
}

const Unfollow: FC<UnfollowProps> = ({
  buttonClassName,
  account,
  small,
  title
}) => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const { setShowAuthModal } = useGlobalModalStateStore();
  const { isFollowPending } = useTransactionStore();

  const [isLoading, setIsLoading] = useState(false);
  const { cache } = useApolloClient();
  const { data: walletClient } = useWalletClient();

  const updateTransactions = ({
    txHash
  }: {
    txHash: string;
  }) => {
    addOptimisticTransaction({
      txHash,
      type: OptmisticTransactionType.Unfollow,
      unfollowOn: account.address
    });
  };

  const updateCache = () => {
    cache.modify({
      fields: { isFollowedByMe: () => false },
      id: cache.identify(account.operations as LoggedInAccountOperations)
    });
  };

  const onCompleted = (hash: string) => {
    updateCache();
    updateTransactions({ txHash: hash });
    setIsLoading(false);
    toast.success("Unfollowed");
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [unfollow] = useUnfollowMutation({
    onCompleted: async ({ unfollow }) => {
      if (unfollow.__typename === "UnfollowResponse") {
        return onCompleted(unfollow.hash);
      }

      if (walletClient) {
        try {
          if (unfollow.__typename === "SponsoredTransactionRequest") {
            const hash = await sendEip712Transaction(walletClient, {
              account: walletClient.account,
              ...sponsoredTransactionData(unfollow.raw)
            });

            return onCompleted(hash);
          }

          if (unfollow.__typename === "SelfFundedTransactionRequest") {
            const hash = await sendTransaction(walletClient, {
              account: walletClient.account,
              ...selfFundedTransactionData(unfollow.raw)
            });

            return onCompleted(hash);
          }
        } catch (error) {
          return onError(error);
        }
      }

      if (unfollow.__typename === "TransactionWillFail") {
        return toast.error(unfollow.reason);
      }
    },
    onError
  });

  const handleCreateUnfollow = async () => {
    if (!currentAccount) {
      setShowAuthModal(true);
      return;
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsLoading(true);
    return await unfollow({
      variables: { request: { account: account.address } }
    });
  };

  return (
    <Button
      aria-label={title}
      className={buttonClassName}
      disabled={isLoading || isFollowPending(account.address)}
      onClick={handleCreateUnfollow}
      size={small ? "sm" : "md"}
    >
      {title}
    </Button>
  );
};

export default Unfollow;
