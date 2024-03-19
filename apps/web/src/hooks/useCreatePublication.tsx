import type {
  AnyPublication,
  MomokaCommentRequest,
  MomokaPostRequest,
  MomokaQuoteRequest,
  OnchainCommentRequest,
  OnchainPostRequest,
  OnchainQuoteRequest
} from '@hey/lens';

import { useApolloClient } from '@apollo/client';
import { LensHub } from '@hey/abis';
import { LENS_HUB } from '@hey/data/constants';
import {
  PublicationDocument,
  useBroadcastOnchainMutation,
  useBroadcastOnMomokaMutation,
  useCommentOnchainMutation,
  useCommentOnMomokaMutation,
  useCreateMomokaCommentTypedDataMutation,
  useCreateMomokaPostTypedDataMutation,
  useCreateMomokaQuoteTypedDataMutation,
  useCreateOnchainCommentTypedDataMutation,
  useCreateOnchainPostTypedDataMutation,
  useCreateOnchainQuoteTypedDataMutation,
  usePostOnchainMutation,
  usePostOnMomokaMutation,
  usePublicationLazyQuery,
  useQuoteOnchainMutation,
  useQuoteOnMomokaMutation
} from '@hey/lens';
import checkDispatcherPermissions from '@hey/lib/checkDispatcherPermissions';
import getSignature from '@hey/lib/getSignature';
import { OptmisticPublicationType } from '@hey/types/enums';
import checkAndToastDispatcherError from '@lib/checkAndToastDispatcherError';
import { useRouter } from 'next/router';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';
import { useSignTypedData, useWriteContract } from 'wagmi';

import useHandleWrongNetwork from './useHandleWrongNetwork';

interface CreatePublicationProps {
  commentOn?: AnyPublication;
  onCompleted: (status?: any) => void;
  onError: (error: any) => void;
  quoteOn?: AnyPublication;
}

const useCreatePublication = ({
  commentOn,
  onCompleted,
  onError,
  quoteOn
}: CreatePublicationProps) => {
  const { push } = useRouter();
  const { cache } = useApolloClient();
  const { currentProfile } = useProfileStore();
  const {
    decrementLensHubOnchainSigNonce,
    incrementLensHubOnchainSigNonce,
    lensHubOnchainSigNonce
  } = useNonceStore((state) => state);
  const { publicationContent } = usePublicationStore();
  const { addTransaction } = useTransactionStore();
  const handleWrongNetwork = useHandleWrongNetwork();
  const { canBroadcast } = checkDispatcherPermissions(currentProfile);

  const isComment = Boolean(commentOn);
  const isQuote = Boolean(quoteOn);

  const generateOptimisticPublication = ({
    txHash,
    txId
  }: {
    txHash?: string;
    txId?: string;
  }) => {
    return {
      ...(isComment && { commentOn: commentOn?.id }),
      content: publicationContent,
      txHash,
      txId,
      type: isComment
        ? OptmisticPublicationType.Comment
        : isQuote
          ? OptmisticPublicationType.Quote
          : OptmisticPublicationType.Post
    };
  };

  const [getPublication] = usePublicationLazyQuery({
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

  const { signTypedDataAsync } = useSignTypedData({ mutation: { onError } });
  const { error, writeContractAsync } = useWriteContract({
    mutation: {
      onError: (error: Error) => {
        onError(error);
        decrementLensHubOnchainSigNonce();
      },
      onSuccess: (hash: string) => {
        onCompleted();
        incrementLensHubOnchainSigNonce();
        addTransaction(generateOptimisticPublication({ txHash: hash }));
      }
    }
  });

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      abi: LensHub,
      address: LENS_HUB,
      args,
      functionName: isComment ? 'comment' : isQuote ? 'quote' : 'post'
    });
  };

  const [broadcastOnMomoka] = useBroadcastOnMomokaMutation({
    onCompleted: ({ broadcastOnMomoka }) => {
      onCompleted(broadcastOnMomoka.__typename);
      if (broadcastOnMomoka.__typename === 'CreateMomokaPublicationResult') {
        onCompleted();
        push(`/posts/${broadcastOnMomoka.id}`);
      }
    },
    onError
  });

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) => {
      onCompleted(broadcastOnchain.__typename);
      if (broadcastOnchain.__typename === 'RelaySuccess') {
        addTransaction(
          generateOptimisticPublication({ txId: broadcastOnchain.txId })
        );
      }
    }
  });

  const typedDataGenerator = async (
    generatedData: any,
    isMomokaPublication = false
  ) => {
    const { id, typedData } = generatedData;
    await handleWrongNetwork();

    if (canBroadcast) {
      const signature = await signTypedDataAsync(getSignature(typedData));
      if (isMomokaPublication) {
        return await broadcastOnMomoka({
          variables: { request: { id, signature } }
        });
      }
      const { data } = await broadcastOnchain({
        variables: { request: { id, signature } }
      });
      if (data?.broadcastOnchain.__typename === 'RelayError') {
        return await write({ args: [typedData.value] });
      }
      incrementLensHubOnchainSigNonce();

      return;
    }

    return await write({ args: [typedData.value] });
  };

  // On-chain typed data generation
  const [createOnchainPostTypedData] = useCreateOnchainPostTypedDataMutation({
    onCompleted: async ({ createOnchainPostTypedData }) =>
      await typedDataGenerator(createOnchainPostTypedData),
    onError
  });

  const [createOnchainCommentTypedData] =
    useCreateOnchainCommentTypedDataMutation({
      onCompleted: async ({ createOnchainCommentTypedData }) =>
        await typedDataGenerator(createOnchainCommentTypedData),
      onError
    });

  const [createOnchainQuoteTypedData] = useCreateOnchainQuoteTypedDataMutation({
    onCompleted: async ({ createOnchainQuoteTypedData }) =>
      await typedDataGenerator(createOnchainQuoteTypedData),
    onError
  });

  // Momoka typed data generation
  const [createMomokaPostTypedData] = useCreateMomokaPostTypedDataMutation({
    onCompleted: async ({ createMomokaPostTypedData }) =>
      await typedDataGenerator(createMomokaPostTypedData, true)
  });

  const [createMomokaCommentTypedData] =
    useCreateMomokaCommentTypedDataMutation({
      onCompleted: async ({ createMomokaCommentTypedData }) =>
        await typedDataGenerator(createMomokaCommentTypedData, true)
    });

  const [createMomokaQuoteTypedData] = useCreateMomokaQuoteTypedDataMutation({
    onCompleted: async ({ createMomokaQuoteTypedData }) =>
      await typedDataGenerator(createMomokaQuoteTypedData, true)
  });

  // Onchain mutations
  const [postOnchain] = usePostOnchainMutation({
    onCompleted: ({ postOnchain }) => {
      onCompleted(postOnchain.__typename);
      if (postOnchain.__typename === 'RelaySuccess') {
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
      if (commentOnchain.__typename === 'RelaySuccess') {
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
      if (quoteOnchain.__typename === 'RelaySuccess') {
        addTransaction(
          generateOptimisticPublication({ txId: quoteOnchain.txId })
        );
      }
    },
    onError
  });

  // Momoka mutations
  const [postOnMomoka] = usePostOnMomokaMutation({
    onCompleted: ({ postOnMomoka }) => {
      onCompleted(postOnMomoka.__typename);

      if (postOnMomoka.__typename === 'CreateMomokaPublicationResult') {
        push(`/posts/${postOnMomoka.id}`);
      }
    },
    onError
  });

  const [commentOnMomoka] = useCommentOnMomokaMutation({
    onCompleted: ({ commentOnMomoka }) => {
      onCompleted(commentOnMomoka.__typename);

      if (commentOnMomoka.__typename === 'CreateMomokaPublicationResult') {
        getPublication({
          variables: { request: { forId: commentOnMomoka.id } }
        });
      }
    },
    onError
  });

  const [quoteOnMomoka] = useQuoteOnMomokaMutation({
    onCompleted: ({ quoteOnMomoka }) => {
      onCompleted(quoteOnMomoka.__typename);

      if (quoteOnMomoka.__typename === 'CreateMomokaPublicationResult') {
        push(`/posts/${quoteOnMomoka.id}`);
      }
    },
    onError
  });

  const createPostOnMomka = async (request: MomokaPostRequest) => {
    const { data } = await postOnMomoka({ variables: { request } });
    if (data?.postOnMomoka?.__typename === 'LensProfileManagerRelayError') {
      const shouldProceed = checkAndToastDispatcherError(
        data.postOnMomoka.reason
      );

      if (!shouldProceed) {
        return;
      }

      return await createMomokaPostTypedData({ variables: { request } });
    }
  };

  const createCommentOnMomka = async (request: MomokaCommentRequest) => {
    const { data } = await commentOnMomoka({ variables: { request } });
    if (data?.commentOnMomoka?.__typename === 'LensProfileManagerRelayError') {
      return await createMomokaCommentTypedData({ variables: { request } });
    }
  };

  const createQuoteOnMomka = async (request: MomokaQuoteRequest) => {
    const { data } = await quoteOnMomoka({ variables: { request } });
    if (data?.quoteOnMomoka?.__typename === 'LensProfileManagerRelayError') {
      return await createMomokaQuoteTypedData({ variables: { request } });
    }
  };

  const createPostOnChain = async (request: OnchainPostRequest) => {
    const variables = {
      options: { overrideSigNonce: lensHubOnchainSigNonce },
      request
    };

    const { data } = await postOnchain({ variables: { request } });
    if (data?.postOnchain?.__typename === 'LensProfileManagerRelayError') {
      return await createOnchainPostTypedData({ variables });
    }
  };

  const createCommentOnChain = async (request: OnchainCommentRequest) => {
    const variables = {
      options: { overrideSigNonce: lensHubOnchainSigNonce },
      request
    };

    const { data } = await commentOnchain({ variables: { request } });
    if (data?.commentOnchain?.__typename === 'LensProfileManagerRelayError') {
      return await createOnchainCommentTypedData({ variables });
    }
  };

  const createQuoteOnChain = async (request: OnchainQuoteRequest) => {
    const variables = {
      options: { overrideSigNonce: lensHubOnchainSigNonce },
      request
    };

    const { data } = await quoteOnchain({ variables: { request } });
    if (data?.quoteOnchain?.__typename === 'LensProfileManagerRelayError') {
      return await createOnchainQuoteTypedData({ variables });
    }
  };

  return {
    createCommentOnChain,
    createCommentOnMomka,
    createMomokaCommentTypedData,
    createMomokaPostTypedData,
    createMomokaQuoteTypedData,
    createOnchainCommentTypedData,
    createOnchainPostTypedData,
    createOnchainQuoteTypedData,
    createPostOnChain,
    createPostOnMomka,
    createQuoteOnChain,
    createQuoteOnMomka,
    error
  };
};

export default useCreatePublication;
