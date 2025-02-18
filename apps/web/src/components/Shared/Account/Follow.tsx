import { useApolloClient } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import {
  type Account,
  type LoggedInAccountOperations,
  useFollowMutation
} from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { Button } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import {
  addOptimisticTransaction,
  useTransactionStore
} from "src/store/persisted/useTransactionStore";

interface FollowProps {
  buttonClassName: string;
  account: Account;
  small: boolean;
  title: string;
}

const Follow: FC<FollowProps> = ({
  buttonClassName,
  account,
  small,
  title
}) => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const { setShowAuthModal } = useGlobalModalStateStore();
  const { isUnfollowPending } = useTransactionStore();

  const [isLoading, setIsLoading] = useState(false);
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateTransactions = ({
    txHash
  }: {
    txHash: string;
  }) => {
    addOptimisticTransaction({
      followOn: account.address,
      txHash,
      type: OptimisticTxType.FOLLOW_ACCOUNT
    });
  };

  const updateCache = () => {
    cache.modify({
      fields: { isFollowedByMe: () => true },
      id: cache.identify(account.operations as LoggedInAccountOperations)
    });
  };

  const onCompleted = (hash: string) => {
    updateCache();
    updateTransactions({ txHash: hash });
    setIsLoading(false);
    toast.success("Followed");
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [follow] = useFollowMutation({
    onCompleted: async ({ follow }) => {
      if (follow.__typename === "FollowResponse") {
        return onCompleted(follow.hash);
      }

      return await handleTransactionLifecycle({
        transactionData: follow,
        onCompleted,
        onError
      });
    },
    onError
  });

  const handleCreateFollow = async () => {
    if (!currentAccount) {
      setShowAuthModal(true);
      return;
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsLoading(true);

    return await follow({
      variables: { request: { account: account.address } }
    });
  };

  return (
    <Button
      aria-label={title}
      className={buttonClassName}
      disabled={isLoading || isUnfollowPending(account.address)}
      onClick={handleCreateFollow}
      outline
      size={small ? "sm" : "md"}
    >
      {title}
    </Button>
  );
};

export default Follow;
