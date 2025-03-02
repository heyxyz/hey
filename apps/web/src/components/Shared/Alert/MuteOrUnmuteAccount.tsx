import { useApolloClient } from "@apollo/client";
import trackEvent from "@helpers/analytics";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import { Events } from "@hey/data/events";
import getAccount from "@hey/helpers/getAccount";
import {
  type LoggedInAccountOperationsFragment,
  useMuteMutation,
  useUnmuteMutation
} from "@hey/indexer";
import { Alert } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useMuteAlertStore } from "src/store/non-persisted/alert/useMuteAlertStore";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const MuteOrUnmuteAccount: FC = () => {
  const { currentAccount } = useAccountStore();
  const {
    mutingOrUnmutingAccount,
    setShowMuteOrUnmuteAlert,
    showMuteOrUnmuteAlert
  } = useMuteAlertStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasMuted, setHasMuted] = useState(
    mutingOrUnmutingAccount?.operations?.isMutedByMe
  );
  const { isSuspended } = useAccountStatus();
  const { cache } = useApolloClient();

  const updateCache = () => {
    cache.modify({
      fields: { isMutedByMe: () => !hasMuted },
      id: cache.identify(
        mutingOrUnmutingAccount?.operations as LoggedInAccountOperationsFragment
      )
    });
  };

  const onCompleted = () => {
    updateCache();
    setIsSubmitting(false);
    setHasMuted(!hasMuted);
    setShowMuteOrUnmuteAlert(false);
    trackEvent(hasMuted ? Events.Account.Unmute : Events.Account.Mute);
    toast.success(hasMuted ? "Unmuted successfully" : "Muted successfully");
  };

  const onError = (error: any) => {
    setIsSubmitting(false);
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

    setIsSubmitting(true);

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
  };

  return (
    <Alert
      confirmText={hasMuted ? "Unmute" : "Mute"}
      description={`Are you sure you want to ${
        hasMuted ? "un-mute" : "mute"
      } ${getAccount(mutingOrUnmutingAccount).usernameWithPrefix}?`}
      isDestructive
      isPerformingAction={isSubmitting}
      onClose={() => setShowMuteOrUnmuteAlert(false)}
      onConfirm={muteOrUnmute}
      show={showMuteOrUnmuteAlert}
      title="Mute Account"
    />
  );
};

export default MuteOrUnmuteAccount;
