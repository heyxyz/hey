import { type Post, useCreatePostMutation } from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { usePostStore } from "src/store/non-persisted/post/usePostStore";
import { addOptimisticTransaction } from "src/store/persisted/useTransactionStore";
import useTransactionLifecycle from "./useTransactionLifecycle";

interface CreatePostProps {
  commentOn?: Post;
  onCompleted: () => void;
  onError: (error: any) => void;
  quoteOf?: Post;
}

const useCreatePost = ({
  commentOn,
  onCompleted,
  onError,
  quoteOf
}: CreatePostProps) => {
  const { postContent } = usePostStore();
  const handleTransactionLifecycle = useTransactionLifecycle();

  const isComment = Boolean(commentOn);
  const isQuote = Boolean(quoteOf);

  const onCompletedWithTransaction = (hash: string) => {
    addOptimisticTransaction({
      ...(isComment && { commentOn: commentOn?.id }),
      content: postContent,
      txHash: hash,
      type: isComment
        ? OptimisticTxType.CREATE_COMMENT
        : isQuote
          ? OptimisticTxType.CREATE_QUOTE
          : OptimisticTxType.CREATE_POST
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
