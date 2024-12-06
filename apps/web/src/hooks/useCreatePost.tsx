import selfFundedTransactionData from "@hey/helpers/selfFundedTransactionData";
import sponsoredTransactionData from "@hey/helpers/sponsoredTransactionData";
import {
  type Post,
  type PostResponse,
  useCreatePostMutation
} from "@hey/indexer";
import { OptmisticPostType } from "@hey/types/enums";
import type { OptimisticTransaction } from "@hey/types/misc";
import toast from "react-hot-toast";
import { usePostStore } from "src/store/non-persisted/post/usePostStore";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";
import { sendEip712Transaction, sendTransaction } from "viem/zksync";
import { useWalletClient } from "wagmi";

interface CreatePostProps {
  commentOn?: Post;
  onCompleted: (post?: PostResponse) => void;
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
  const { addTransaction } = useTransactionStore();
  const { data: walletClient } = useWalletClient();

  const isComment = Boolean(commentOn);
  const isQuote = Boolean(quoteOf);

  const generateOptimisticPublication = ({
    txHash
  }: {
    txHash: string;
  }): OptimisticTransaction => {
    return {
      ...(isComment && { commentOn: commentOn?.id }),
      content: postContent,
      txHash,
      type: isComment
        ? OptmisticPostType.Comment
        : isQuote
          ? OptmisticPostType.Quote
          : OptmisticPostType.Post
    };
  };

  // Onchain mutations
  const [createPost] = useCreatePostMutation({
    onCompleted: async ({ post }) => {
      if (post.__typename === "PostResponse") {
        addTransaction(generateOptimisticPublication({ txHash: post.hash }));
        return onCompleted(post);
      }

      if (walletClient) {
        if (post.__typename === "SponsoredTransactionRequest") {
          const hash = await sendEip712Transaction(walletClient, {
            account: walletClient.account,
            ...sponsoredTransactionData(post.raw)
          });
          addTransaction(generateOptimisticPublication({ txHash: hash }));

          return onCompleted();
        }

        if (post.__typename === "SelfFundedTransactionRequest") {
          const hash = await sendTransaction(walletClient, {
            account: walletClient.account,
            ...selfFundedTransactionData(post.raw)
          });
          addTransaction(generateOptimisticPublication({ txHash: hash }));

          return onCompleted();
        }
      }

      if (post.__typename === "TransactionWillFail") {
        return toast.error(post.reason);
      }
    },
    onError
  });

  return { createPost };
};

export default useCreatePost;
