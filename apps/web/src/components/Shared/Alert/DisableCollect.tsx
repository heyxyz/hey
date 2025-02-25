import { useApolloClient } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import { type Post, useDisablePostActionMutation } from "@hey/indexer";
import { Alert } from "@hey/ui";
import { type FC, useState } from "react";
import { toast } from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useDisableCollectAlertStore } from "src/store/non-persisted/alert/useDisableCollectAlertStore";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";

const DisableCollect: FC = () => {
  const { disablingPost, setShowDisableCollectAlert, showDisableCollectAlert } =
    useDisableCollectAlertStore();
  const { isSuspended } = useAccountStatus();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cache } = useApolloClient();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = () => {
    cache.modify({
      fields: {
        actions: (existingActions = []) =>
          existingActions.filter(
            (action: any) => action.__typename !== "SimpleCollectAction"
          )
      },
      id: cache.identify(disablingPost as Post)
    });
  };

  const onCompleted = () => {
    setIsSubmitting(false);
    setShowDisableCollectAlert(false, null);
    updateCache();
    toast.success("Collect action disabled");
  };

  const onError = (error: any) => {
    errorToast(error);
    setIsSubmitting(false);
  };

  const [disablePostAction] = useDisablePostActionMutation({
    onCompleted: async ({ disablePostAction }) => {
      if (disablePostAction.__typename === "DisablePostActionResponse") {
        return onCompleted();
      }

      return await handleTransactionLifecycle({
        transactionData: disablePostAction,
        onCompleted,
        onError
      });
    },
    onError
  });

  const disableCollect = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setIsSubmitting(true);

    return await disablePostAction({
      variables: {
        request: { action: { simpleCollect: true }, post: disablingPost?.id }
      }
    });
  };

  return (
    <Alert
      confirmText="Disable"
      description="This will disable the collect action for this post."
      isDestructive
      isPerformingAction={isSubmitting}
      onClose={() => setShowDisableCollectAlert(false, null)}
      onConfirm={disableCollect}
      show={showDisableCollectAlert}
      title="Disable Collect?"
    />
  );
};

export default DisableCollect;
