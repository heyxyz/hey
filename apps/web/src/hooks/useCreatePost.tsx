import { type PostFragment, useCreatePostMutation } from "@hey/indexer";
import { addOptimisticPublication } from "src/store/persisted/useOptimisticPublicationStore";
import useTransactionLifecycle from "./useTransactionLifecycle";

interface CreatePostProps {
  commentOn?: PostFragment;
  onCompleted: () => void;
  onError: (error: any) => void;
}

const useCreatePost = ({
  commentOn,
  onCompleted,
  onError
}: CreatePostProps) => {
  const handleTransactionLifecycle = useTransactionLifecycle();
  const isComment = Boolean(commentOn);

  const onCompletedWithTransaction = (hash: string) => {
    addOptimisticPublication({
      ...(isComment && { commentOn: commentOn?.id }),
      txHash: hash
    });

    return onCompleted();
  };

  // Onchain mutations
  const [createPost] = useCreatePostMutation({
    onCompleted: async ({ post }) => {
      if (post.__typename === "PostResponse") {
        return onCompletedWithTransaction(post.hash);
      }

      return await handleTransactionLifecycle({
        transactionData: post,
        onCompleted: onCompletedWithTransaction,
        onError
      });
    },
    onError
  });

  return { createPost };
};

export default useCreatePost;
