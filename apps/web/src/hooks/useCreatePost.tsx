import { useApolloClient } from "@apollo/client";
import { LensHub } from "@hey/abis";
import { LENS_HUB } from "@hey/data/constants";
import { OptmisticPostType } from "@hey/types/enums";
import type { OptimisticTransaction } from "@hey/types/misc";
import { usePostStore } from "src/store/non-persisted/post/usePostStore";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";
import { useWriteContract } from "wagmi";
import useHandleWrongNetwork from "./useHandleWrongNetwork";

interface CreatePostProps {
  commentOn?: AnyPublication;
  onCompleted: (status?: any) => void;
  onError: (error: any) => void;
  quoteOn?: AnyPublication;
}

const useCreatePost = ({
  commentOn,
  onCompleted,
  onError,
  quoteOn
}: CreatePostProps) => {
  const { cache } = useApolloClient();
  const { postContent } = usePostStore();
  const { addTransaction } = useTransactionStore();
  const handleWrongNetwork = useHandleWrongNetwork();

  const isComment = Boolean(commentOn);
  const isQuote = Boolean(quoteOn);

  const generateOptimisticPublication = ({
    txHash,
    txId
  }: {
    txHash?: string;
    txId?: string;
  }): OptimisticTransaction => {
    return {
      ...(isComment && { commentOn: commentOn?.id }),
      content: postContent,
      txHash,
      txId,
      type: isComment
        ? OptmisticPostType.Comment
        : isQuote
          ? OptmisticPostType.Quote
          : OptmisticPostType.Post
    };
  };

  const [getPost] = usePublicationLazyQuery({
    onCompleted: (data) => {
      if (data?.publication) {
        cache.modify({
          fields: {
            publications: () => {
              cache.writeQuery({
                data: { publication: data?.publication },
                query: PublicationDocument
              });
            }
          }
        });
      }
    }
  });

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
  const [postOnchain] = usePostOnchainMutation({
    onCompleted: ({ postOnchain }) => {
      onCompleted(postOnchain.__typename);
      if (postOnchain.__typename === "RelaySuccess") {
        addTransaction(
          generateOptimisticPublication({ txId: postOnchain.txId })
        );
      }
    },
    onError
  });

  const [commentOnchain] = useCommentOnchainMutation({
    onCompleted: ({ commentOnchain }) => {
      onCompleted(commentOnchain.__typename);
      if (commentOnchain.__typename === "RelaySuccess") {
        addTransaction(
          generateOptimisticPublication({ txId: commentOnchain.txId })
        );
      }
    },
    onError
  });

  const [quoteOnchain] = useQuoteOnchainMutation({
    onCompleted: ({ quoteOnchain }) => {
      onCompleted(quoteOnchain.__typename);
      if (quoteOnchain.__typename === "RelaySuccess") {
        addTransaction(
          generateOptimisticPublication({ txId: quoteOnchain.txId })
        );
      }
    },
    onError
  });

  const createPostOnChain = async (request: OnchainPostRequest) => {
    const variables = { request };

    const { data } = await postOnchain({ variables: { request } });
    if (data?.postOnchain?.__typename === "LensProfileManagerRelayError") {
      return await createOnchainPostTypedData({ variables });
    }
  };

  const createCommentOnChain = async (request: OnchainCommentRequest) => {
    const variables = { request };

    const { data } = await commentOnchain({ variables: { request } });
    if (data?.commentOnchain?.__typename === "LensProfileManagerRelayError") {
      return await createOnchainCommentTypedData({ variables });
    }
  };

  const createQuoteOnChain = async (request: OnchainQuoteRequest) => {
    const variables = { request };

    const { data } = await quoteOnchain({ variables: { request } });
    if (data?.quoteOnchain?.__typename === "LensProfileManagerRelayError") {
      return await createOnchainQuoteTypedData({ variables });
    }
  };

  return {
    createCommentOnChain,
    createPostOnChain,
    createQuoteOnChain,
    error
  };
};

export default useCreatePost;
