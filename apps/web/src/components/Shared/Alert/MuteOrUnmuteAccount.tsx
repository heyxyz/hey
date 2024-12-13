import { useApolloClient } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import getAccount from "@hey/helpers/getAccount";
import {
  type LoggedInAccountOperations,
  useMuteMutation,
  useUnmuteMutation
} from "@hey/indexer";
import { Alert } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useGlobalAlertStateStore } from "src/store/non-persisted/useGlobalAlertStateStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";

const MuteOrUnmuteAccount: FC = () => {
  const { currentAccount } = useAccountStore();
  const {
    mutingOrUnmutingAccount,
    setShowMuteOrUnmuteAlert,
    showMuteOrUnmuteAlert
  } = useGlobalAlertStateStore();
  const { isBlockOrUnblockPending } = useTransactionStore();

  const [isLoading, setIsLoading] = useState(false);
  const [hasMuted, setHasMuted] = useState(
    mutingOrUnmutingAccount?.operations?.isMutedByMe
  );
  const { isSuspended } = useAccountStatus();
  const { cache } = useApolloClient();

  const updateCache = () => {
    cache.modify({
      fields: { isMutedByMe: () => !hasMuted },
      id: cache.identify(
        mutingOrUnmutingAccount?.operations as LoggedInAccountOperations
      )
    });
  };

  const onCompleted = () => {
    updateCache();
    setIsLoading(false);
    setHasMuted(!hasMuted);
    setShowMuteOrUnmuteAlert(false, null);
    toast.success(hasMuted ? "Unmuted" : "Muted");
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const [mute] = useMuteMutation({
    onCompleted,
    onError
  });

  const [unmute] = useUnmuteMutation({
    onCompleted,
    onError
  });

  const muteOrUnmute = async () => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);

      // Unmute
      if (hasMuted) {
        return await unmute({
          variables: {
            request: { account: mutingOrUnmutingAccount?.address }
          }
        });
      }

      // Mute
      return await mute({
        variables: {
          request: { account: mutingOrUnmutingAccount?.address }
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Alert
      confirmText={hasMuted ? "Unmute" : "Mute"}
      description={`Are you sure you want to ${
        hasMuted ? "un-mute" : "mute"
      } ${getAccount(mutingOrUnmutingAccount).usernameWithPrefix}?`}
      isDestructive
      isPerformingAction={
        isLoading || isBlockOrUnblockPending(mutingOrUnmutingAccount?.address)
      }
      onClose={() => setShowMuteOrUnmuteAlert(false, null)}
      onConfirm={muteOrUnmute}
      show={showMuteOrUnmuteAlert}
      title="Mute Account"
    />
  );
};

export default MuteOrUnmuteAccount;
