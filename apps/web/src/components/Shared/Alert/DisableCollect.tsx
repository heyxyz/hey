import type { ApolloCache } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import { type Post, useDisablePostActionMutation } from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { Alert } from "@hey/ui";
import { type FC, useState } from "react";
import { toast } from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useDisableCollectAlertStateStore } from "src/store/non-persisted/alert/useDisableCollectAlertStateStore";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { addSimpleOptimisticTransaction } from "src/store/persisted/useTransactionStore";

const DisableCollect: FC = () => {
  const { disablingPost, setShowDisableCollectAlert, showDisableCollectAlert } =
    useDisableCollectAlertStateStore();
  const { isSuspended } = useAccountStatus();
  const [loading, setLoading] = useState(false);
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = (cache: ApolloCache<any>) => {
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

  const onCompleted = (hash: string) => {
    addSimpleOptimisticTransaction(hash, OptimisticTxType.DISABLE_COLLECT);
    setLoading(false);
    setShowDisableCollectAlert(false, null);
    toast.success("Collect action disabled");
  };

  const onError = (error: any) => {
    errorToast(error);
    setLoading(false);
  };

  const [disablePostAction] = useDisablePostActionMutation({
    onCompleted: async ({ disablePostAction }) => {
      if (disablePostAction.__typename === "DisablePostActionResponse") {
        return onCompleted(disablePostAction.hash);
      }

      return await handleTransactionLifecycle({
        transactionData: disablePostAction,
        onCompleted,
        onError
      });
    },
    onError,
    update: updateCache
  });

  const disableCollect = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    setLoading(true);

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
      isPerformingAction={loading}
      onClose={() => setShowDisableCollectAlert(false, null)}
      onConfirm={disableCollect}
      show={showDisableCollectAlert}
      title="Disable Collect?"
    />
  );
};

export default DisableCollect;
