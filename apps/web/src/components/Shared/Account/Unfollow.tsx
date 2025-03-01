import { useApolloClient } from "@apollo/client";
import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import { Events } from "@hey/data/events";
import {
  type AccountFragment,
  type LoggedInAccountOperationsFragment,
  useUnfollowMutation
} from "@hey/indexer";
import { Button } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useAuthModalStore } from "src/store/non-persisted/modal/useAuthModalStore";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface UnfollowProps {
  buttonClassName: string;
  account: AccountFragment;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = () => {
    cache.modify({
      fields: { isFollowedByMe: () => false },
      id: cache.identify(
        account.operations as LoggedInAccountOperationsFragment
      )
    });
  };

  const onCompleted = () => {
    updateCache();
    setIsSubmitting(false);
    trackEvent(Events.Account.Unfollow);
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [unfollow] = useUnfollowMutation({
    onCompleted: async ({ unfollow }) => {
      if (unfollow.__typename === "UnfollowResponse") {
        return onCompleted();
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
      return setShowAuthModal(true);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsSubmitting(true);
    return await unfollow({
      variables: { request: { account: account.address } }
    });
  };

  return (
    <Button
      aria-label={title}
      className={buttonClassName}
      disabled={isSubmitting}
      onClick={handleCreateUnfollow}
      size={small ? "sm" : "md"}
    >
      {title}
    </Button>
  );
};

export default Unfollow;
