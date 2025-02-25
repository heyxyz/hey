import { useApolloClient } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import getAccount from "@hey/helpers/getAccount";
import {
  type Account,
  type LoggedInAccountOperations,
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

  const [loading, setLoading] = useState(false);
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
        blockingorUnblockingAccount?.operations as LoggedInAccountOperations
      )
    });
    cache.evict({ id: cache.identify(blockingorUnblockingAccount as Account) });
  };

  const onCompleted = () => {
    updateCache();
    setLoading(false);
    setHasBlocked(!hasBlocked);
    setShowBlockOrUnblockAlert(false, null);
    toast.success(
      hasBlocked ? "Unblocked successfully" : "Blocked successfully"
    );
  };

  const onError = (error: any) => {
    setLoading(false);
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

    try {
      setLoading(true);

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
      isPerformingAction={loading}
      onClose={() => setShowBlockOrUnblockAlert(false, null)}
      onConfirm={blockOrUnblock}
      show={showBlockOrUnblockAlert}
      title="Block Account"
    />
  );
};

export default BlockOrUnblockAccount;
