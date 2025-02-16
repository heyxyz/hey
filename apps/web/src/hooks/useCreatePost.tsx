import selfFundedTransactionData from "@hey/helpers/selfFundedTransactionData";
import sponsoredTransactionData from "@hey/helpers/sponsoredTransactionData";
import { type Post, useCreatePostMutation } from "@hey/indexer";
import { OptimisticTxType } from "@hey/types/enums";
import { usePostStore } from "src/store/non-persisted/post/usePostStore";
import { addOptimisticTransaction } from "src/store/persisted/useTransactionStore";
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";

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
  const { data: walletClient } = useWalletClient();

  const isComment = Boolean(commentOn);
  const isQuote = Boolean(quoteOf);

  const updateTransactions = ({
    txHash
  }: {
    txHash: string;
  }) => {
    addOptimisticTransaction({
      ...(isComment && { commentOn: commentOn?.id }),
      content: postContent,
      txHash,
      type: isComment
        ? OptimisticTxType.CREATE_COMMENT
        : isQuote
          ? OptimisticTxType.CREATE_QUOTE
          : OptimisticTxType.CREATE_POST
    });
  };

  // Onchain mutations
  const [createPost] = useCreatePostMutation({
    onCompleted: async ({ post }) => {
      if (post.__typename === "PostResponse") {
        updateTransactions({ txHash: post.hash });
        return onCompleted();
      }

      if (walletClient) {
        try {
          if (post.__typename === "SponsoredTransactionRequest") {
            const hash = await sendEip712Transaction(walletClient, {
              account: walletClient.account,
              ...sponsoredTransactionData(post.raw)
            });
            updateTransactions({ txHash: hash });

            return onCompleted();
          }

          if (post.__typename === "SelfFundedTransactionRequest") {
            const hash = await sendTransaction(walletClient, {
              account: walletClient.account,
              ...selfFundedTransactionData(post.raw)
            });
            updateTransactions({ txHash: hash });

            return onCompleted();
          }

          if (post.__typename === "TransactionWillFail") {
            return onError({ message: post.reason });
          }
        } catch (error) {
          return onError(error);
        }
      }
    },
    onError
  });

  return { createPost };
};

export default useCreatePost;
