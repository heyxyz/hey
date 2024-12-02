import { LensHub } from "@hey/abis";
import { LENS_HUB } from "@hey/data/constants";
import {
  type CreatePostRequest,
  type Post,
  useCreatePostMutation
} from "@hey/indexer";
import { OptmisticPostType } from "@hey/types/enums";
import type { OptimisticTransaction } from "@hey/types/misc";
import { usePostStore } from "src/store/non-persisted/post/usePostStore";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";
import { useWriteContract } from "wagmi";

interface CreatePostProps {
  commentOn?: Post;
  onCompleted: (status?: any) => void;
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

  const { error, writeContractAsync } = useWriteContract({
    mutation: {
      onError,
      onSuccess: (hash: string) => {
        addTransaction(generateOptimisticPublication({ txHash: hash }));
        onCompleted();
      }
    }
  });

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      __mode: "prepared",
      abi: LensHub,
      address: LENS_HUB,
      args,
      functionName: isComment ? "comment" : isQuote ? "quote" : "post"
    });
  };

  // Onchain mutations
  const [post] = useCreatePostMutation({
    onCompleted: ({ post }) => {
      onCompleted(post.__typename);
      if (post.__typename === "PostResponse") {
        addTransaction(generateOptimisticPublication({ txHash: post.hash }));
      }
    },
    onError
  });

  const createPost = async (request: CreatePostRequest) => {
    const { data } = await post({ variables: { request } });
    if (data?.post?.__typename === "SelfFundedTransactionRequest") {
      // TODO: Lens v3 Handle self-funded transaction
    }
  };

  return { createPost, error };
};

export default useCreatePost;
