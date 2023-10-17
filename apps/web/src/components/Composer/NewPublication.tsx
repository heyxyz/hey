import QuotedPublication from '@components/Publication/QuotedPublication';
import { AudioPublicationSchema } from '@components/Shared/Audio';
import Wrapper from '@components/Shared/Embed/Wrapper';
import EmojiPicker from '@components/Shared/EmojiPicker';
import withLexicalContext from '@components/Shared/Lexical/withLexicalContext';
import NewAttachments from '@components/Shared/NewAttachments';
import {
  ChatBubbleLeftRightIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import { LensHub } from '@hey/abis';
import { LENSHUB_PROXY } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { PUBLICATION } from '@hey/data/tracking';
import type {
  AnyPublication,
  MomokaCommentRequest,
  MomokaPostRequest,
  OnchainCommentRequest,
  OnchainPostRequest,
  OnchainQuoteRequest,
  Quote
} from '@hey/lens';
import {
  PublicationDocument,
  ReferenceModuleType,
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
import { useApolloClient } from '@hey/lens/apollo';
import getProfile from '@hey/lib/getProfile';
import getSignature from '@hey/lib/getSignature';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import type { IGif } from '@hey/types/giphy';
import type { NewAttachment } from '@hey/types/misc';
import { Button, Card, ErrorMessage, Spinner } from '@hey/ui';
import cn from '@hey/ui/cn';
import { $convertFromMarkdownString } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import collectModuleParams from '@lib/collectModuleParams';
import errorToast from '@lib/errorToast';
import getTextNftUrl from '@lib/getTextNftUrl';
import { Leafwatch } from '@lib/leafwatch';
import uploadToArweave from '@lib/uploadToArweave';
import { useUnmountEffect } from 'framer-motion';
import { $getRoot } from 'lexical';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { OptmisticPublicationType } from 'src/enums';
import useCreatePoll from 'src/hooks/useCreatePoll';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import usePublicationMetadata from 'src/hooks/usePublicationMetadata';
import { useAppStore } from 'src/store/app';
import { useCollectModuleStore } from 'src/store/collect-module';
import { useGlobalModalStateStore } from 'src/store/modals';
import { useNonceStore } from 'src/store/nonce';
import { usePublicationStore } from 'src/store/publication';
import { useReferenceModuleStore } from 'src/store/reference-module';
import { useTransactionPersistStore } from 'src/store/transaction';
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts';
import { v4 as uuid } from 'uuid';
import { useContractWrite, useSignTypedData } from 'wagmi';

import LivestreamSettings from './Actions/LivestreamSettings';
import LivestreamEditor from './Actions/LivestreamSettings/LivestreamEditor';
import PollEditor from './Actions/PollSettings/PollEditor';
import Editor from './Editor';
import Discard from './Post/Discard';

const Attachment = dynamic(
  () => import('@components/Composer/Actions/Attachment'),
  {
    loading: () => <div className="shimmer mb-1 h-5 w-5 rounded-lg" />
  }
);
const Gif = dynamic(() => import('@components/Composer/Actions/Gif'), {
  loading: () => <div className="shimmer mb-1 h-5 w-5 rounded-lg" />
});
const CollectSettings = dynamic(
  () => import('@components/Composer/Actions/CollectSettings'),
  {
    loading: () => <div className="shimmer mb-1 h-5 w-5 rounded-lg" />
  }
);
const ReferenceSettings = dynamic(
  () => import('@components/Composer/Actions/ReferenceSettings'),
  {
    loading: () => <div className="shimmer mb-1 h-5 w-5 rounded-lg" />
  }
);
const PollSettings = dynamic(
  () => import('@components/Composer/Actions/PollSettings'),
  {
    loading: () => <div className="shimmer mb-1 h-5 w-5 rounded-lg" />
  }
);

interface NewPublicationProps {
  publication: AnyPublication;
}

const NewPublication: FC<NewPublicationProps> = ({ publication }) => {
  const { push } = useRouter();
  const { cache } = useApolloClient();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  // Modal store
  const setShowNewPostModal = useGlobalModalStateStore(
    (state) => state.setShowNewPostModal
  );
  const setShowDiscardModal = useGlobalModalStateStore(
    (state) => state.setShowDiscardModal
  );

  // Nonce store
  const { userSigNonce, setUserSigNonce } = useNonceStore();

  // Publication store
  const {
    publicationContent,
    setPublicationContent,
    quotedPublication,
    setQuotedPublication,
    audioPublication,
    attachments,
    setAttachments,
    addAttachments,
    isUploading,
    videoThumbnail,
    setVideoThumbnail,
    showPollEditor,
    setShowPollEditor,
    resetPollConfig,
    pollConfig,
    showLiveVideoEditor,
    setShowLiveVideoEditor,
    resetLiveVideoConfig
  } = usePublicationStore();

  // Transaction persist store
  const { txnQueue, setTxnQueue } = useTransactionPersistStore(
    (state) => state
  );

  // Collect module store
  const { collectModule, reset: resetCollectSettings } = useCollectModuleStore(
    (state) => state
  );

  // Reference module store
  const { selectedReferenceModule, onlyFollowers, degreesOfSeparation } =
    useReferenceModuleStore();

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [publicationContentError, setPublicationContentError] = useState('');

  const [editor] = useLexicalComposerContext();
  const [createPoll] = useCreatePoll();
  const getMetadata = usePublicationMetadata();
  const handleWrongNetwork = useHandleWrongNetwork();

  const isComment = Boolean(publication);
  const isQuote = Boolean(quotedPublication);
  const hasAudio = attachments[0]?.type === 'Audio';
  const hasVideo = attachments[0]?.type === 'Video';

  // Lens manager
  const canUseRelay = currentProfile?.lensManager;
  const isSponsored = currentProfile?.sponsor;

  const onCompleted = (
    __typename?: 'RelayError' | 'RelaySuccess' | 'LensProfileManagerRelayError'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return;
    }

    setIsLoading(false);
    editor.update(() => {
      $getRoot().clear();
    });
    setPublicationContent('');
    setQuotedPublication(null);
    setShowPollEditor(false);
    resetPollConfig();
    setShowLiveVideoEditor(false);
    resetLiveVideoConfig();
    setAttachments([]);
    setVideoThumbnail({
      url: '',
      type: '',
      uploading: false
    });
    resetCollectSettings();

    if (!isComment) {
      setShowNewPostModal(false);
    }

    // Track in leafwatch
    const eventProperties = {
      publication_type: 'public',
      publication_collect_module: collectModule.type,
      publication_reference_module: selectedReferenceModule,
      publication_reference_module_degrees_of_separation:
        selectedReferenceModule ===
        ReferenceModuleType.DegreesOfSeparationReferenceModule
          ? degreesOfSeparation
          : null,
      publication_has_attachments: attachments.length > 0,
      publication_has_poll: showPollEditor
    };
    Leafwatch.track(
      isComment ? PUBLICATION.NEW_COMMENT : PUBLICATION.NEW_POST,
      eventProperties
    );
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  useUpdateEffect(() => {
    setPublicationContentError('');
  }, [audioPublication]);

  useEffectOnce(() => {
    editor.update(() => {
      $convertFromMarkdownString(publicationContent);
    });
  });

  const generateOptimisticPublication = ({
    txHash,
    txId
  }: {
    txHash?: string;
    txId?: string;
  }) => {
    return {
      id: uuid(),
      ...(isComment && { parent: publication.id }),
      type: isComment
        ? OptmisticPublicationType.NewComment
        : OptmisticPublicationType.NewPost,
      txHash,
      txId,
      content: publicationContent,
      attachments,
      title: audioPublication.title,
      cover: audioPublication.cover,
      author: audioPublication.artist
    };
  };

  const { signTypedDataAsync } = useSignTypedData({
    onError
  });

  const { error, write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: isComment ? 'comment' : isQuote ? 'quote' : 'post',
    onSuccess: ({ hash }) => {
      onCompleted();
      setUserSigNonce(userSigNonce + 1);
      setTxnQueue([
        generateOptimisticPublication({ txHash: hash }),
        ...txnQueue
      ]);
    },
    onError: (error) => {
      onError(error);
      setUserSigNonce(userSigNonce - 1);
    }
  });

  const [broadcastOnMomoka] = useBroadcastOnMomokaMutation({
    onCompleted: (data) => {
      onCompleted();
      if (data?.broadcastOnMomoka.__typename === 'RelayError') {
        return toast.error(Errors.SomethingWentWrong);
      }

      if (
        data?.broadcastOnMomoka.__typename === 'CreateMomokaPublicationResult'
      ) {
        push(`/posts/${data?.broadcastOnMomoka.id}`);
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

  const typedDataGenerator = async (
    generatedData: any,
    isDataAvailabilityPublication = false
  ) => {
    const { id, typedData } = generatedData;
    const signature = await signTypedDataAsync(getSignature(typedData));
    if (isDataAvailabilityPublication) {
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
  };

  // Normal typed data generation
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

  // Data availability typed data generation
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
    onCompleted: (data) => {
      if (data?.postOnMomoka?.__typename === 'LensProfileManagerRelayError') {
        return;
      }

      if (data.postOnMomoka.__typename === 'CreateMomokaPublicationResult') {
        onCompleted();
        const { id } = data.postOnMomoka;
        push(`/posts/${id}`);
      }
    },
    onError
  });

  const [commentOnMomoka] = useCommentOnMomokaMutation({
    onCompleted: (data) => {
      if (
        data?.commentOnMomoka?.__typename === 'LensProfileManagerRelayError'
      ) {
        return;
      }

      if (data.commentOnMomoka.__typename === 'CreateMomokaPublicationResult') {
        onCompleted();
        const { id } = data.commentOnMomoka;
        getPublication({ variables: { request: { forId: id } } });
      }
    },
    onError
  });

  const [quoteOnMomoka] = useQuoteOnMomokaMutation({
    onCompleted: (data) => {
      if (data?.quoteOnMomoka?.__typename === 'LensProfileManagerRelayError') {
        return;
      }

      if (data.quoteOnMomoka.__typename === 'CreateMomokaPublicationResult') {
        onCompleted();
        const { id } = data.quoteOnMomoka;
        push(`/posts/${id}`);
      }
    },
    onError
  });

  const createOnMomka = async (request: any) => {
    if (isComment) {
      const { data } = await commentOnMomoka({
        variables: { request }
      });

      if (
        data?.commentOnMomoka?.__typename === 'LensProfileManagerRelayError'
      ) {
        await createMomokaCommentTypedData({ variables: { request } });
      }

      return;
    }

    if (isQuote) {
      const { data } = await quoteOnMomoka({
        variables: { request }
      });

      if (data?.quoteOnMomoka?.__typename === 'LensProfileManagerRelayError') {
        await createMomokaQuoteTypedData({ variables: { request } });
      }

      return;
    }

    const { data } = await postOnMomoka({
      variables: { request }
    });

    if (data?.postOnMomoka?.__typename === 'LensProfileManagerRelayError') {
      await createMomokaPostTypedData({ variables: { request } });
    }

    return;
  };

  const createOnChain = async (request: any) => {
    const variables = {
      options: { overrideSigNonce: userSigNonce },
      request
    };

    if (isComment) {
      const { data } = await commentOnchain({
        variables: { request }
      });
      if (data?.commentOnchain?.__typename === 'LensProfileManagerRelayError') {
        return await createOnchainCommentTypedData({ variables });
      }

      return;
    }

    if (isQuote) {
      const { data } = await quoteOnchain({
        variables: { request }
      });
      if (data?.quoteOnchain?.__typename === 'LensProfileManagerRelayError') {
        return await createOnchainQuoteTypedData({ variables });
      }

      return;
    }

    const { data } = await postOnchain({ variables: { request } });
    if (data?.postOnchain?.__typename === 'LensProfileManagerRelayError') {
      return await createOnchainPostTypedData({ variables });
    }

    return;
  };

  const getAnimationUrl = () => {
    if (attachments.length > 0 || hasAudio || hasVideo) {
      return attachments[0]?.uri;
    }

    return null;
  };

  const getTitlePrefix = () => {
    if (hasVideo) {
      return 'Video';
    }

    return isComment ? 'Comment' : isQuote ? 'Quote' : 'Post';
  };

  const createPublication = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (handleWrongNetwork()) {
      return;
    }

    if (isComment && publication.momoka?.proof && !isSponsored) {
      return toast.error(
        'Momoka is currently in beta - during this time certain actions are not available to all profiles.'
      );
    }

    try {
      setIsLoading(true);
      if (hasAudio) {
        setPublicationContentError('');
        const parsedData = AudioPublicationSchema.safeParse(audioPublication);
        if (!parsedData.success) {
          const issue = parsedData.error.issues[0];
          return setPublicationContentError(issue.message);
        }
      }

      if (publicationContent.length === 0 && attachments.length === 0) {
        return setPublicationContentError(
          `${
            isComment ? 'Comment' : isQuote ? 'Quote' : 'Post'
          } should not be empty!`
        );
      }

      setPublicationContentError('');
      let textNftImageUrl = null;
      if (!attachments.length) {
        textNftImageUrl = await getTextNftUrl(
          publicationContent,
          getProfile(currentProfile).slug,
          new Date().toLocaleString()
        );
      }

      let processedPublicationContent = publicationContent;

      if (showPollEditor) {
        processedPublicationContent = await createPoll();
      }

      const baseMetadata = {
        content: processedPublicationContent,
        marketplace: {
          name: hasAudio
            ? audioPublication.title
            : `${getTitlePrefix()} by ${
                getProfile(currentProfile).slugWithPrefix
              }`,
          description: processedPublicationContent,
          animation_url: getAnimationUrl() || textNftImageUrl,
          external_url: `https://hey.xyz${getProfile(currentProfile).link}`
        }
      };

      const metadata = getMetadata({ baseMetadata });

      const noCollect = !collectModule.type;
      const useDataAvailability = isComment
        ? publication.momoka?.proof && noCollect
        : noCollect;
      const arweaveId = await uploadToArweave(metadata);

      // Payload for the open action module
      let openActionModules = [];
      if (collectModule.type) {
        openActionModules.push({
          collectOpenAction: collectModuleParams(collectModule, currentProfile)
        });
      }

      // Payload for the post/comment
      const request:
        | OnchainPostRequest
        | OnchainCommentRequest
        | OnchainQuoteRequest = {
        contentURI: `ar://${arweaveId}`,
        ...(isComment && { commentOn: targetPublication.id }),
        ...(isQuote && { quoteOn: quotedPublication?.id }),
        openActionModules,
        ...(onlyFollowers && {
          referenceModule:
            selectedReferenceModule ===
            ReferenceModuleType.FollowerOnlyReferenceModule
              ? { followerOnlyReferenceModule: true }
              : {
                  degreesOfSeparationReferenceModule: {
                    commentsRestricted: true,
                    mirrorsRestricted: true,
                    quotesRestricted: true,
                    degreesOfSeparation
                  }
                }
        })
      };

      // Payload for the data availability post/comment
      const dataAvailablityRequest: MomokaPostRequest | MomokaCommentRequest = {
        ...(isComment && { commentOn: targetPublication.id }),
        ...(isQuote && { quoteOn: quotedPublication?.id }),
        contentURI: `ar://${arweaveId}`
      };

      if (canUseRelay) {
        if (useDataAvailability && isSponsored) {
          return await createOnMomka(dataAvailablityRequest);
        }

        return await createOnChain(request);
      }

      if (isComment) {
        return await createOnchainCommentTypedData({
          variables: {
            options: { overrideSigNonce: userSigNonce },
            request: request as OnchainCommentRequest
          }
        });
      }

      if (isQuote) {
        return await createOnchainQuoteTypedData({
          variables: {
            options: { overrideSigNonce: userSigNonce },
            request: request as OnchainQuoteRequest
          }
        });
      }

      return await createOnchainPostTypedData({
        variables: { options: { overrideSigNonce: userSigNonce }, request }
      });
    } catch (error) {
      onError(error);
    }
  };

  const setGifAttachment = (gif: IGif) => {
    const attachment: NewAttachment = {
      id: uuid(),
      uri: gif.images.original.url,
      mimeType: 'image/gif',
      previewUri: gif.images.original.url,
      type: 'Image'
    };
    addAttachments([attachment]);
  };

  const isSubmitDisabledByPoll = showPollEditor
    ? !pollConfig.choices.length ||
      pollConfig.choices.some((choice) => !choice.length)
    : false;

  const onDiscardClick = () => {
    setShowNewPostModal(false);
    setShowDiscardModal(false);
  };

  useUnmountEffect(() => {
    setPublicationContent('');
    setShowPollEditor(false);
    resetPollConfig();
    setShowLiveVideoEditor(false);
    resetLiveVideoConfig();
    setAttachments([]);
    setVideoThumbnail({
      url: '',
      type: '',
      uploading: false
    });
    resetCollectSettings();
  });

  return (
    <Card
      onClick={() => setShowEmojiPicker(false)}
      className={cn(
        { '!rounded-b-xl !rounded-t-none border-none': !isComment },
        'pb-3'
      )}
    >
      {error ? (
        <ErrorMessage
          className="!rounded-none"
          title="Transaction failed!"
          error={error}
        />
      ) : null}
      <Editor />
      {publicationContentError ? (
        <div className="mt-1 px-5 pb-3 text-sm font-bold text-red-500">
          {publicationContentError}
        </div>
      ) : null}
      {showPollEditor ? <PollEditor /> : null}
      {showLiveVideoEditor ? <LivestreamEditor /> : null}
      {quotedPublication ? (
        <Wrapper className="m-5" zeroPadding>
          <QuotedPublication publication={quotedPublication as Quote} isNew />
        </Wrapper>
      ) : null}
      <div className="block items-center px-5 sm:flex">
        <div className="flex items-center space-x-4">
          <Attachment />
          <EmojiPicker
            emojiClassName="text-brand"
            setShowEmojiPicker={setShowEmojiPicker}
            showEmojiPicker={showEmojiPicker}
            setEmoji={(emoji) => {
              setShowEmojiPicker(false);
              editor.update(() => {
                // @ts-ignore
                const index = editor?._editorState?._selection?.focus?.offset;
                const updatedContent =
                  publicationContent.substring(0, index) +
                  emoji +
                  publicationContent.substring(
                    index,
                    publicationContent.length
                  );
                $convertFromMarkdownString(updatedContent);
              });
            }}
          />
          <Gif setGifAttachment={(gif: IGif) => setGifAttachment(gif)} />
          {!publication?.momoka?.proof ? (
            <>
              <CollectSettings />
              <ReferenceSettings />
            </>
          ) : null}
          <PollSettings />
          {!isComment && <LivestreamSettings />}
        </div>
        <div className="ml-auto pt-2 sm:pt-0">
          <Button
            disabled={
              isLoading ||
              isUploading ||
              isSubmitDisabledByPoll ||
              videoThumbnail.uploading
            }
            icon={
              isLoading ? (
                <Spinner size="xs" />
              ) : isComment ? (
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
              ) : (
                <PencilSquareIcon className="h-4 w-4" />
              )
            }
            onClick={createPublication}
          >
            {isComment ? 'Comment' : 'Post'}
          </Button>
        </div>
      </div>
      <div className="px-5">
        <NewAttachments attachments={attachments} />
      </div>
      <Discard onDiscard={onDiscardClick} />
    </Card>
  );
};

export default withLexicalContext(NewPublication);
