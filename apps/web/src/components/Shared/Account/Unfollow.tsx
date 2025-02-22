import { useApolloClient } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import {
  type Account,
  type LoggedInAccountOperations,
  useUnfollowMutation
} from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { Button } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAuthModalStore } from "src/store/non-persisted/modal/useAuthModalStore";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import {
  addOptimisticTransaction,
  useTransactionStore
} from "src/store/persisted/useTransactionStore";

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
  const { setShowAuthModal } = useAuthModalStore();
  const { isFollowPending } = useTransactionStore();
  const [isLoading, setIsLoading] = useState(false);
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = () => {
    cache.modify({
      fields: { isFollowedByMe: () => false },
      id: cache.identify(account.operations as LoggedInAccountOperations)
    });
  };

  const onCompleted = (hash: string) => {
    addOptimisticTransaction({
      txHash: hash,
      type: OptimisticTxType.UNFOLLOW_ACCOUNT,
      unfollowOn: account.address
    });

    updateCache();
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

      if (unfollow.__typename === "AccountFollowOperationValidationFailed") {
        return onError({ message: unfollow.reason });
      }

      return await handleTransactionLifecycle({
        transactionData: unfollow,
        onCompleted,
        onError
      });
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
