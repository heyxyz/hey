import { useApolloClient } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import {
  type Account,
  type LoggedInAccountOperations,
  useFollowMutation
} from "@hey/indexer";
import { Button } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAuthModalStore } from "src/store/non-persisted/modal/useAuthModalStore";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";

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
  const { setShowAuthModal } = useAuthModalStore();

  const [isLoading, setIsLoading] = useState(false);
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = () => {
    cache.modify({
      fields: { isFollowedByMe: () => true },
      id: cache.identify(account.operations as LoggedInAccountOperations)
    });
  };

  const onCompleted = () => {
    updateCache();
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
        return onCompleted();
      }

      if (follow.__typename === "AccountFollowOperationValidationFailed") {
        return onError({ message: follow.reason });
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
      return setShowAuthModal(true);
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
      disabled={isLoading}
      onClick={handleCreateFollow}
      outline
      size={small ? "sm" : "md"}
    >
      {title}
    </Button>
  );
};

export default Follow;
