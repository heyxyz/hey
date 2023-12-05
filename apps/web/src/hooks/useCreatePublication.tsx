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
import { LENSHUB_PROXY } from '@hey/data/constants';
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
import { useRouter } from 'next/router';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';
import { useContractWrite, useSignTypedData } from 'wagmi';

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
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const lensHubOnchainSigNonce = useNonceStore(
    (state) => state.lensHubOnchainSigNonce
  );
  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  );
  const publicationContent = usePublicationStore(
    (state) => state.publicationContent
  );
  const txnQueue = useTransactionStore((state) => state.txnQueue);
  const setTxnQueue = useTransactionStore((state) => state.setTxnQueue);
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
        ? OptmisticPublicationType.NewComment
        : isQuote
          ? OptmisticPublicationType.NewQuote
          : OptmisticPublicationType.NewPost
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

  const { signTypedDataAsync } = useSignTypedData({
    onError
  });

  const { error, write } = useContractWrite({
    abi: LensHub,
    address: LENSHUB_PROXY,
    functionName: isComment ? 'comment' : isQuote ? 'quote' : 'post',
    onError: (error) => {
      onError(error);
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1);
    },
    onSuccess: ({ hash }) => {
      onCompleted();
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);
      setTxnQueue([
        generateOptimisticPublication({ txHash: hash }),
        ...txnQueue
      ]);
    }
  });

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
        setTxnQueue([
          generateOptimisticPublication({ txId: broadcastOnchain.txId }),
          ...txnQueue
        ]);
      }
    }
  });

  const typedDataGenerator = async (
    generatedData: any,
    isMomokaPublication = false
  ) => {
    const { id, typedData } = generatedData;

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
        return write({ args: [typedData.value] });
      }
      setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1);

      return;
    }

    return write({ args: [typedData.value] });
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
        setTxnQueue([
          generateOptimisticPublication({ txId: postOnchain.txId }),
          ...txnQueue
        ]);
      }
    },
    onError
  });

  const [commentOnchain] = useCommentOnchainMutation({
    onCompleted: ({ commentOnchain }) => {
      onCompleted(commentOnchain.__typename);
      if (commentOnchain.__typename === 'RelaySuccess') {
        setTxnQueue([
          generateOptimisticPublication({
            txId: commentOnchain.txId
          }),
          ...txnQueue
        ]);
      }
    },
    onError
  });

  const [quoteOnchain] = useQuoteOnchainMutation({
    onCompleted: ({ quoteOnchain }) => {
      onCompleted(quoteOnchain.__typename);
      if (quoteOnchain.__typename === 'RelaySuccess') {
        setTxnQueue([
          generateOptimisticPublication({
            txId: quoteOnchain.txId
          }),
          ...txnQueue
        ]);
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
