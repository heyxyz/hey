import type { ApolloCache } from "@apollo/client";
import errorToast from "@helpers/errorToast";
import { Errors } from "@hey/data/errors";
import { useDeletePostMutation } from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { Alert } from "@hey/ui";
import type { FC } from "react";
import { toast } from "react-hot-toast";
import useTransactionLifecycle from "src/hooks/useTransactionLifecycle";
import { useDeletePostAlertStore } from "src/store/non-persisted/alert/useDeletePostAlertStore";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { addSimpleOptimisticTransaction } from "src/store/persisted/useTransactionStore";

const DeletePost: FC = () => {
  const { deletingPost, setShowPostDeleteAlert, showPostDeleteAlert } =
    useDeletePostAlertStore();
  const { isSuspended } = useAccountStatus();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const updateCache = (cache: ApolloCache<any>) => {
    cache.evict({
      id: `${deletingPost?.__typename}:${deletingPost?.id}`
    });
  };

  const onCompleted = (hash: string) => {
    addSimpleOptimisticTransaction(hash, OptimisticTxType.DELETE_POST);
    setShowPostDeleteAlert(false, null);
    toast.success("Post deleted");
  };

  const onError = (error: any) => {
    errorToast(error);
  };

  const [deletePost, { loading }] = useDeletePostMutation({
    onCompleted: async ({ deletePost }) => {
      if (deletePost.__typename === "DeletePostResponse") {
        return onCompleted(deletePost.hash);
      }

      return await handleTransactionLifecycle({
        transactionData: deletePost,
        onCompleted,
        onError
      });
    },
    update: updateCache
  });

  const deletePublication = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    return await deletePost({
      variables: { request: { post: deletingPost?.id } }
    });
  };

  return (
    <Alert
      confirmText="Delete"
      description="This can't be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results."
      isDestructive
      isPerformingAction={loading}
      onClose={() => setShowPostDeleteAlert(false, null)}
      onConfirm={deletePublication}
      show={showPostDeleteAlert}
      title="Delete Publication?"
    />
  );
};

export default DeletePost;
