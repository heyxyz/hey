import { useApolloClient } from "@apollo/client";
import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import { Events } from "@hey/data/events";
import getAccount from "@hey/helpers/getAccount";
import {
  type AccountFragment,
  type LoggedInAccountOperationsFragment,
  useBlockMutation,
  useUnblockMutation
} from "@hey/indexer";
import { Alert } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useBlockAlertStore } from "src/store/non-persisted/alert/useBlockAlertStore";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const BlockOrUnblockAccount: FC = () => {
  const { currentAccount } = useAccountStore();
  const {
    blockingorUnblockingAccount,
    setShowBlockOrUnblockAlert,
    showBlockOrUnblockAlert
  } = useBlockAlertStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasBlocked, setHasBlocked] = useState(
    blockingorUnblockingAccount?.operations?.isBlockedByMe
  );
  const { isSuspended } = useAccountStatus();
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = () => {
    cache.modify({
      fields: { isBlockedByMe: () => !hasBlocked },
      id: cache.identify(
        blockingorUnblockingAccount?.operations as LoggedInAccountOperationsFragment
      )
    });
    cache.evict({
      id: cache.identify(blockingorUnblockingAccount as AccountFragment)
    });
  };

  const onCompleted = () => {
    updateCache();
    setIsSubmitting(false);
    setHasBlocked(!hasBlocked);
    setShowBlockOrUnblockAlert(false);
    trackEvent(hasBlocked ? Events.Account.Unblock : Events.Account.Block);
    toast.success(
      hasBlocked ? "Unblocked successfully" : "Blocked successfully"
    );
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [block] = useBlockMutation({
    onCompleted: async ({ block }) => {
      if (block.__typename === "AccountBlockedResponse") {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        transactionData: block,
        onCompleted,
        onError
      });
    },
    onError
  });

  const [unblock] = useUnblockMutation({
    onCompleted: async ({ unblock }) => {
      if (unblock.__typename === "AccountUnblockedResponse") {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        transactionData: unblock,
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

    setIsSubmitting(true);

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
  };

  return (
    <Alert
      confirmText={hasBlocked ? "Unblock" : "Block"}
      description={`Are you sure you want to ${
        hasBlocked ? "un-block" : "block"
      } ${getAccount(blockingorUnblockingAccount).usernameWithPrefix}?`}
      isDestructive
      isPerformingAction={isSubmitting}
      onClose={() => setShowBlockOrUnblockAlert(false)}
      onConfirm={blockOrUnblock}
      show={showBlockOrUnblockAlert}
      title="Block Account"
    />
  );
};

export default BlockOrUnblockAccount;
