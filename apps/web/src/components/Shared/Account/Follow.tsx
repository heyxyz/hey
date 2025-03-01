import { useApolloClient } from "@apollo/client";
import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import { Events } from "@hey/data/events";
import {
  type AccountFragment,
  type LoggedInAccountOperationsFragment,
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
  onFollow?: () => void;
  buttonClassName: string;
  account: AccountFragment;
  small: boolean;
  title?: string;
}

const Follow: FC<FollowProps> = ({
  onFollow,
  buttonClassName,
  account,
  small,
  title = "Follow"
}) => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();
  const { setShowAuthModal } = useAuthModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = () => {
    cache.modify({
      fields: { isFollowedByMe: () => true },
      id: cache.identify(
        account.operations as LoggedInAccountOperationsFragment
      )
    });
  };

  const onCompleted = () => {
    updateCache();
    setIsSubmitting(false);
    onFollow?.();
    trackEvent(Events.Account.Follow);
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
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

    setIsSubmitting(true);

    return await follow({
      variables: { request: { account: account.address } }
    });
  };

  return (
    <Button
      aria-label={title}
      className={buttonClassName}
      disabled={isSubmitting}
      onClick={handleCreateFollow}
      outline
      size={small ? "sm" : "md"}
    >
      {title}
    </Button>
  );
};

export default Follow;
