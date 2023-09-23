import QuotedPublication from '@components/Publication/QuotedPublication';
import Attachments from '@components/Shared/Attachments';
import { AudioPublicationSchema } from '@components/Shared/Audio';
import Wrapper from '@components/Shared/Embed/Wrapper';
import EmojiPicker from '@components/Shared/EmojiPicker';
import withLexicalContext from '@components/Shared/Lexical/withLexicalContext';
import {
  ChatBubbleLeftRightIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import { MetadataAttributeType } from '@lens-protocol/metadata';
import { LensHub } from '@lenster/abis';
import {
  ALLOWED_AUDIO_TYPES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  LENSHUB_PROXY
} from '@lenster/data/constants';
import { Errors } from '@lenster/data/errors';
import { PUBLICATION } from '@lenster/data/tracking';
import type {
  AnyPublication,
  MomokaCommentRequest,
  MomokaPostRequest,
  OnchainCommentRequest,
  OnchainPostRequest
} from '@lenster/lens';
import {
  LegacyPublicationMetadataMainFocusType,
  PublicationDocument,
  ReferenceModuleType,
  useBroadcastOnchainMutation,
  useBroadcastOnMomokaMutation,
  useCommentOnchainMutation,
  useCommentOnMomokaMutation,
  useCreateMomokaCommentTypedDataMutation,
  useCreateMomokaPostTypedDataMutation,
  useCreateOnchainCommentTypedDataMutation,
  useCreateOnchainPostTypedDataMutation,
  usePostOnchainMutation,
  usePostOnMomokaMutation,
  usePublicationLazyQuery
} from '@lenster/lens';
import { useApolloClient } from '@lenster/lens/apollo';
import getSignature from '@lenster/lib/getSignature';
import { isMirrorPublication } from '@lenster/lib/publicationHelpers';
import type { IGif } from '@lenster/types/giphy';
import type { NewLensterAttachment } from '@lenster/types/misc';
import { Button, Card, ErrorMessage, Spinner } from '@lenster/ui';
import cn from '@lenster/ui/cn';
import { $convertFromMarkdownString } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import collectModuleParams from '@lib/collectModuleParams';
import errorToast from '@lib/errorToast';
import getTextNftUrl from '@lib/getTextNftUrl';
import { Leafwatch } from '@lib/leafwatch';
import uploadToArweave from '@lib/uploadToArweave';
import { t } from '@lingui/macro';
import { useUnmountEffect } from 'framer-motion';
import { $getRoot } from 'lexical';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { OptmisticPublicationType } from 'src/enums';
import useCreatePoll from 'src/hooks/useCreatePoll';
import useEthersWalletClient from 'src/hooks/useEthersWalletClient';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useAppStore } from 'src/store/app';
import { useCollectModuleStore } from 'src/store/collect-module';
import { useGlobalModalStateStore } from 'src/store/modals';
import { useNonceStore } from 'src/store/nonce';
import { usePublicationStore } from 'src/store/publication';
import { useReferenceModuleStore } from 'src/store/reference-module';
import { useTransactionPersistStore } from 'src/store/transaction';
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts';
import { v4 as uuid } from 'uuid';
import { useContractWrite, usePublicClient, useSignTypedData } from 'wagmi';

import PollEditor from './Actions/PollSettings/PollEditor';
import Editor from './Editor';
import getMetadata from './getMetadata';
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
    videoDurationInSeconds,
    showPollEditor,
    setShowPollEditor,
    resetPollConfig,
    pollConfig
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
  const publicClient = usePublicClient();
  const { data: walletClient } = useEthersWalletClient();
  const [createPoll] = useCreatePoll();
  const handleWrongNetwork = useHandleWrongNetwork();

  const isComment = Boolean(publication);
  const hasAudio = ALLOWED_AUDIO_TYPES.includes(
    attachments[0]?.original.mimeType
  );
  const hasVideo = ALLOWED_VIDEO_TYPES.includes(
    attachments[0]?.original.mimeType
  );

  // Dispatcher
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
      publication_attachment_types:
        attachments.length > 0
          ? attachments.map((attachment) => attachment.original.mimeType)
          : null,
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
      author: audioPublication.author
    };
  };

  const { signTypedDataAsync } = useSignTypedData({
    onError
  });

  const { error, write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: isComment ? 'comment' : 'post',
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
  const [createOnchainCommentTypedData] =
    useCreateOnchainCommentTypedDataMutation({
      onCompleted: async ({ createOnchainCommentTypedData }) =>
        await typedDataGenerator(createOnchainCommentTypedData),
      onError
    });

  const [createOnchainPostTypedData] = useCreateOnchainPostTypedDataMutation({
    onCompleted: async ({ createOnchainPostTypedData }) =>
      await typedDataGenerator(createOnchainPostTypedData),
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

    const { data } = await postOnchain({ variables: { request } });
    if (data?.postOnchain?.__typename === 'LensProfileManagerRelayError') {
      return await createOnchainPostTypedData({ variables });
    }

    return;
  };

  const getMainContentFocus = () => {
    if (attachments.length > 0) {
      if (hasAudio) {
        return LegacyPublicationMetadataMainFocusType.Audio;
      } else if (
        ALLOWED_IMAGE_TYPES.includes(attachments[0]?.original.mimeType)
      ) {
        return LegacyPublicationMetadataMainFocusType.Image;
      } else if (hasVideo) {
        return LegacyPublicationMetadataMainFocusType.Video;
      } else {
        return LegacyPublicationMetadataMainFocusType.TextOnly;
      }
    } else {
      return LegacyPublicationMetadataMainFocusType.TextOnly;
    }
  };

  const getAnimationUrl = () => {
    if (attachments.length > 0 || hasAudio || hasVideo) {
      return attachments[0]?.original.url;
    }

    return null;
  };

  const getAttachmentImage = () => {
    return hasAudio
      ? audioPublication.cover
      : hasVideo
      ? videoThumbnail.url
      : attachments[0]?.original.url;
  };

  const getTitlePrefix = () => {
    if (hasVideo) {
      return 'Video';
    }

    return isComment ? 'Comment' : 'Post';
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
        t`Momoka is currently in beta - during this time certain actions are not available to all profiles.`
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
          `${isComment ? 'Comment' : 'Post'} should not be empty!`
        );
      }

      setPublicationContentError('');
      let textNftImageUrl = null;
      if (!attachments.length && !collectModule.type) {
        textNftImageUrl = await getTextNftUrl(
          publicationContent,
          currentProfile.handle,
          new Date().toLocaleString()
        );
      }

      const attributes = [
        {
          type: MetadataAttributeType.STRING,
          key: 'type',
          value: getMainContentFocus()?.toLowerCase()
        },
        ...(quotedPublication
          ? [
              {
                type: MetadataAttributeType.STRING,
                key: 'quotedPublicationId',
                value: quotedPublication.id
              }
            ]
          : []),
        ...(hasAudio
          ? [
              {
                type: MetadataAttributeType.STRING,
                key: 'author',
                value: audioPublication.author
              }
            ]
          : []),
        ...(hasVideo
          ? [
              {
                type: MetadataAttributeType.STRING,
                key: 'durationInSeconds',
                value: videoDurationInSeconds
              }
            ]
          : [])
      ];

      let processedPublicationContent = publicationContent;

      if (showPollEditor) {
        processedPublicationContent = await createPoll();
      }

      const baseMetadata = {
        content: processedPublicationContent,
        marketplace: {
          name: hasAudio
            ? audioPublication.title
            : `${getTitlePrefix()} by @${currentProfile?.handle}`,
          description: processedPublicationContent,
          animation_url: getAnimationUrl() || textNftImageUrl,
          external_url: `https://lenster.xyz/u/${currentProfile?.handle}`,
          attributes: attributes
        }
      };

      const metadata = getMetadata({
        baseMetadata,
        attachments,
        cover: getAttachmentImage()
      });

      const noCollect = !collectModule.type;
      const useDataAvailability = isComment
        ? publication.momoka?.proof && noCollect
        : noCollect;

      const arweaveId = await uploadToArweave(metadata);

      // Payload for the post/comment
      const request: OnchainPostRequest | OnchainCommentRequest = {
        contentURI: `ar://${arweaveId}`,
        ...(isComment && {
          commentOn: targetPublication.id
        }),
        openActionModules: [
          {
            collectOpenAction: collectModuleParams(
              collectModule,
              currentProfile
            )
          }
        ],
        referenceModule:
          selectedReferenceModule ===
          ReferenceModuleType.FollowerOnlyReferenceModule
            ? { followerOnlyReferenceModule: onlyFollowers ? true : false }
            : {
                degreesOfSeparationReferenceModule: {
                  commentsRestricted: true,
                  mirrorsRestricted: true,
                  quotesRestricted: true,
                  degreesOfSeparation
                }
              }
      };

      // Payload for the data availability post/comment
      const dataAvailablityRequest: MomokaPostRequest | MomokaCommentRequest = {
        ...(isComment && {
          commentOn: targetPublication.id
        }),
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

      return await createOnchainPostTypedData({
        variables: { options: { overrideSigNonce: userSigNonce }, request }
      });
    } catch (error) {
      onError(error);
    }
  };

  const setGifAttachment = (gif: IGif) => {
    const attachment: NewLensterAttachment = {
      id: uuid(),
      previewItem: gif.images.original.url,
      original: {
        url: gif.images.original.url,
        mimeType: 'image/gif',
        altTag: gif.title
      }
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
      {JSON.stringify(attachments)}
      {error ? (
        <ErrorMessage
          className="!rounded-none"
          title={t`Transaction failed!`}
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
      {quotedPublication ? (
        <Wrapper className="m-5" zeroPadding>
          <QuotedPublication publication={quotedPublication} isNew />
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
            {isComment ? t`Comment` : t`Post`}
          </Button>
        </div>
      </div>
      <div className="px-5">
        <Attachments attachments={attachments} isNew />
      </div>
      <Discard onDiscard={onDiscardClick} />
    </Card>
  );
};

export default withLexicalContext(NewPublication);
