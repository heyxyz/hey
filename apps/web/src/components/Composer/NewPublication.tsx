import Attachments from '@components/Shared/Attachments';
import { AudioPublicationSchema } from '@components/Shared/Audio';
import withLexicalContext from '@components/Shared/Lexical/withLexicalContext';
import useCreatePoll from '@components/utils/hooks/useCreatePoll';
import type { IGif } from '@giphy/js-types';
import { ChatAlt2Icon, PencilAltIcon } from '@heroicons/react/outline';
import type {
  CollectCondition,
  EncryptedMetadata,
  FollowCondition,
  LensEnvironment
} from '@lens-protocol/sdk-gated';
import { LensGatedSDK } from '@lens-protocol/sdk-gated';
import type {
  AccessConditionOutput,
  CreatePublicPostRequest
} from '@lens-protocol/sdk-gated/dist/graphql/types';
import { $convertFromMarkdownString } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import getTextNftUrl from '@lib/getTextNftUrl';
import getUserLocale from '@lib/getUserLocale';
import { Mixpanel } from '@lib/mixpanel';
import splitSignature from '@lib/splitSignature';
import uploadToArweave from '@lib/uploadToArweave';
import { t } from '@lingui/macro';
import { LensHub } from 'abis';
import clsx from 'clsx';
import {
  ALLOWED_AUDIO_TYPES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  APP_NAME,
  LENSHUB_PROXY,
  LIT_PROTOCOL_ENVIRONMENT
} from 'data/constants';
import Errors from 'data/errors';
import type {
  CreatePublicCommentRequest,
  MetadataAttributeInput,
  Publication,
  PublicationMetadataMediaInput,
  PublicationMetadataV2Input
} from 'lens';
import {
  CollectModules,
  PublicationDocument,
  PublicationMainFocus,
  PublicationMetadataDisplayTypes,
  ReferenceModules,
  useBroadcastDataAvailabilityMutation,
  useBroadcastMutation,
  useCreateCommentTypedDataMutation,
  useCreateCommentViaDispatcherMutation,
  useCreateDataAvailabilityCommentTypedDataMutation,
  useCreateDataAvailabilityCommentViaDispatcherMutation,
  useCreateDataAvailabilityPostTypedDataMutation,
  useCreateDataAvailabilityPostViaDispatcherMutation,
  useCreatePostTypedDataMutation,
  useCreatePostViaDispatcherMutation,
  usePublicationLazyQuery
} from 'lens';
import { useApolloClient } from 'lens/apollo';
import { $getRoot } from 'lexical';
import getSignature from 'lib/getSignature';
import getTags from 'lib/getTags';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { OptmisticPublicationType } from 'src/enums';
import { useAccessSettingsStore } from 'src/store/access-settings';
import { useAppStore } from 'src/store/app';
import { useCollectModuleStore } from 'src/store/collect-module';
import { usePublicationStore } from 'src/store/publication';
import { useReferenceModuleStore } from 'src/store/reference-module';
import { useTransactionPersistStore } from 'src/store/transaction';
import { PUBLICATION } from 'src/tracking';
import type { NewLensterAttachment } from 'src/types';
import { Button, Card, ErrorMessage, Spinner } from 'ui';
import { v4 as uuid } from 'uuid';
import {
  useContractWrite,
  useProvider,
  useSigner,
  useSignTypedData
} from 'wagmi';

import PollEditor from './Actions/PollSettings/PollEditor';
import Editor from './Editor';

const Attachment = dynamic(
  () => import('@components/Composer/Actions/Attachment'),
  {
    loading: () => <div className="shimmer mb-1 h-5 w-5 rounded-lg" />
  }
);
const Giphy = dynamic(() => import('@components/Composer/Actions/Giphy'), {
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
const AccessSettings = dynamic(
  () => import('@components/Composer/Actions/AccessSettings'),
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
  publication: Publication;
}

const NewPublication: FC<NewPublicationProps> = ({ publication }) => {
  const { push } = useRouter();
  const { cache } = useApolloClient();

  // App store
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Publication store
  const publicationContent = usePublicationStore(
    (state) => state.publicationContent
  );
  const setPublicationContent = usePublicationStore(
    (state) => state.setPublicationContent
  );
  const audioPublication = usePublicationStore(
    (state) => state.audioPublication
  );
  const setShowNewPostModal = usePublicationStore(
    (state) => state.setShowNewPostModal
  );
  const attachments = usePublicationStore((state) => state.attachments);
  const setAttachments = usePublicationStore((state) => state.setAttachments);
  const addAttachments = usePublicationStore((state) => state.addAttachments);
  const isUploading = usePublicationStore((state) => state.isUploading);
  const videoThumbnail = usePublicationStore((state) => state.videoThumbnail);
  const setVideoThumbnail = usePublicationStore(
    (state) => state.setVideoThumbnail
  );
  const videoDurationInSeconds = usePublicationStore(
    (state) => state.videoDurationInSeconds
  );
  const showPollEditor = usePublicationStore((state) => state.showPollEditor);
  const setShowPollEditor = usePublicationStore(
    (state) => state.setShowPollEditor
  );
  const resetPollConfig = usePublicationStore((state) => state.resetPollConfig);

  // Transaction persist store
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const setTxnQueue = useTransactionPersistStore((state) => state.setTxnQueue);

  // Collect module store
  const selectedCollectModule = useCollectModuleStore(
    (state) => state.selectedCollectModule
  );
  const payload = useCollectModuleStore((state) => state.payload);
  const resetCollectSettings = useCollectModuleStore((state) => state.reset);

  // Reference module store
  const selectedReferenceModule = useReferenceModuleStore(
    (state) => state.selectedReferenceModule
  );
  const onlyFollowers = useReferenceModuleStore((state) => state.onlyFollowers);
  const degreesOfSeparation = useReferenceModuleStore(
    (state) => state.degreesOfSeparation
  );

  // Access module store
  const restricted = useAccessSettingsStore((state) => state.restricted);
  const followToView = useAccessSettingsStore((state) => state.followToView);
  const collectToView = useAccessSettingsStore((state) => state.collectToView);
  const resetAccessSettings = useAccessSettingsStore((state) => state.reset);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [publicationContentError, setPublicationContentError] = useState('');

  const [editor] = useLexicalComposerContext();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [createPoll] = useCreatePoll();

  const isComment = Boolean(publication);
  const hasAudio = ALLOWED_AUDIO_TYPES.includes(
    attachments[0]?.original.mimeType
  );
  const hasVideo = ALLOWED_VIDEO_TYPES.includes(
    attachments[0]?.original.mimeType
  );

  // Dispatcher
  const canUseRelay = currentProfile?.dispatcher?.canUseRelay;
  const isSponsored = currentProfile?.dispatcher?.sponsor;

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return;
    }

    setIsLoading(false);
    editor.update(() => {
      $getRoot().clear();
    });
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
    resetAccessSettings();
    if (!isComment) {
      setShowNewPostModal(false);
    }

    // Track in mixpanel
    const eventProperties = {
      publication_type: restricted ? 'token_gated' : 'public',
      publication_collect_module: selectedCollectModule,
      publication_reference_module: selectedReferenceModule,
      publication_reference_module_degrees_of_separation:
        selectedReferenceModule ===
        ReferenceModules.DegreesOfSeparationReferenceModule
          ? degreesOfSeparation
          : null,
      publication_has_attachments: attachments.length > 0,
      publication_attachment_types:
        attachments.length > 0
          ? attachments.map((attachment) => attachment.original.mimeType)
          : null
    };
    Mixpanel.track(
      isComment ? PUBLICATION.NEW_COMMENT : PUBLICATION.NEW_POST,
      eventProperties
    );
  };

  const onError = (error: any) => {
    setIsLoading(false);
    toast.error(
      error?.data?.message ?? error?.message ?? Errors.SomethingWentWrong
    );
  };

  useEffect(() => {
    setPublicationContentError('');
  }, [audioPublication]);

  useEffect(() => {
    editor.update(() => {
      $convertFromMarkdownString(publicationContent);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    functionName: isComment ? 'commentWithSig' : 'postWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: ({ hash }) => {
      onCompleted();
      setTxnQueue([
        generateOptimisticPublication({ txHash: hash }),
        ...txnQueue
      ]);
    },
    onError
  });

  const [broadcastDataAvailability] = useBroadcastDataAvailabilityMutation({
    onCompleted: (data) => {
      onCompleted();
      if (data?.broadcastDataAvailability.__typename === 'RelayError') {
        return toast.error(Errors.SomethingWentWrong);
      }

      if (
        data?.broadcastDataAvailability.__typename ===
        'CreateDataAvailabilityPublicationResult'
      ) {
        push(`/posts/${data?.broadcastDataAvailability.id}`);
      }
    },
    onError
  });

  const [broadcast] = useBroadcastMutation({
    onCompleted: ({ broadcast }) => {
      onCompleted(broadcast.__typename);
      if (broadcast.__typename === 'RelayerResult') {
        setTxnQueue([
          generateOptimisticPublication({ txId: broadcast.txId }),
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
            publications() {
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
    isDataAvailabilityPublication: boolean = false
  ) => {
    const { id, typedData } = generatedData;
    const {
      profileId,
      contentURI,
      collectModule,
      collectModuleInitData,
      referenceModule,
      referenceModuleInitData,
      referenceModuleData,
      deadline
    } = typedData.value;
    const signature = await signTypedDataAsync(getSignature(typedData));
    const { v, r, s } = splitSignature(signature);
    const sig = { v, r, s, deadline };
    const inputStruct = {
      profileId,
      contentURI,
      collectModule,
      collectModuleInitData,
      referenceModule,
      referenceModuleInitData,
      referenceModuleData,
      ...(isComment && {
        profileIdPointed: typedData.value.profileIdPointed,
        pubIdPointed: typedData.value.pubIdPointed
      }),
      sig
    };

    if (isDataAvailabilityPublication) {
      return await broadcastDataAvailability({
        variables: { request: { id, signature } }
      });
    }

    setUserSigNonce(userSigNonce + 1);
    const { data } = await broadcast({
      variables: { request: { id, signature } }
    });
    if (data?.broadcast.__typename === 'RelayError') {
      return write({ recklesslySetUnpreparedArgs: [inputStruct] });
    }
  };

  // Normal typed data generation
  const [createCommentTypedData] = useCreateCommentTypedDataMutation({
    onCompleted: async ({ createCommentTypedData }) =>
      await typedDataGenerator(createCommentTypedData),
    onError
  });

  const [createPostTypedData] = useCreatePostTypedDataMutation({
    onCompleted: async ({ createPostTypedData }) =>
      await typedDataGenerator(createPostTypedData),
    onError
  });

  // Data availability typed data generation
  const [createDataAvailabilityPostTypedData] =
    useCreateDataAvailabilityPostTypedDataMutation({
      onCompleted: async ({ createDataAvailabilityPostTypedData }) =>
        await typedDataGenerator(createDataAvailabilityPostTypedData, true)
    });

  const [createDataAvailabilityCommentTypedData] =
    useCreateDataAvailabilityCommentTypedDataMutation({
      onCompleted: async ({ createDataAvailabilityCommentTypedData }) =>
        await typedDataGenerator(createDataAvailabilityCommentTypedData, true)
    });

  const [createCommentViaDispatcher] = useCreateCommentViaDispatcherMutation({
    onCompleted: ({ createCommentViaDispatcher }) => {
      onCompleted(createCommentViaDispatcher.__typename);
      if (createCommentViaDispatcher.__typename === 'RelayerResult') {
        setTxnQueue([
          generateOptimisticPublication({
            txId: createCommentViaDispatcher.txId
          }),
          ...txnQueue
        ]);
      }
    },
    onError
  });

  const [createPostViaDispatcher] = useCreatePostViaDispatcherMutation({
    onCompleted: ({ createPostViaDispatcher }) => {
      onCompleted(createPostViaDispatcher.__typename);
      if (createPostViaDispatcher.__typename === 'RelayerResult') {
        setTxnQueue([
          generateOptimisticPublication({ txId: createPostViaDispatcher.txId }),
          ...txnQueue
        ]);
      }
    },
    onError
  });

  const [createDataAvailabilityPostViaDispatcher] =
    useCreateDataAvailabilityPostViaDispatcherMutation({
      onCompleted: (data) => {
        if (
          data?.createDataAvailabilityPostViaDispatcher?.__typename ===
          'RelayError'
        ) {
          return;
        }

        if (
          data.createDataAvailabilityPostViaDispatcher.__typename ===
          'CreateDataAvailabilityPublicationResult'
        ) {
          onCompleted();
          const { id } = data.createDataAvailabilityPostViaDispatcher;
          push(`/posts/${id}`);
        }
      },
      onError
    });

  const [createDataAvailabilityCommentViaDispatcher] =
    useCreateDataAvailabilityCommentViaDispatcherMutation({
      onCompleted: (data) => {
        if (
          data?.createDataAvailabilityCommentViaDispatcher?.__typename ===
          'RelayError'
        ) {
          return;
        }

        if (
          data.createDataAvailabilityCommentViaDispatcher.__typename ===
          'CreateDataAvailabilityPublicationResult'
        ) {
          onCompleted();
          const { id } = data.createDataAvailabilityCommentViaDispatcher;
          getPublication({ variables: { request: { publicationId: id } } });
        }
      },
      onError
    });

  const createViaDataAvailablityDispatcher = async (request: any) => {
    const variables = { request };

    if (isComment) {
      const { data } = await createDataAvailabilityCommentViaDispatcher({
        variables
      });

      if (
        data?.createDataAvailabilityCommentViaDispatcher?.__typename ===
        'RelayError'
      ) {
        await createDataAvailabilityCommentTypedData({ variables });
      }

      return;
    }

    const { data } = await createDataAvailabilityPostViaDispatcher({
      variables
    });

    if (
      data?.createDataAvailabilityPostViaDispatcher?.__typename === 'RelayError'
    ) {
      await createDataAvailabilityPostTypedData({ variables });
    }

    return;
  };

  const createViaDispatcher = async (request: any) => {
    const variables = {
      options: { overrideSigNonce: userSigNonce },
      request
    };

    if (isComment) {
      const { data } = await createCommentViaDispatcher({
        variables: { request }
      });
      if (data?.createCommentViaDispatcher?.__typename === 'RelayError') {
        return await createCommentTypedData({ variables });
      }

      return;
    }

    const { data } = await createPostViaDispatcher({ variables: { request } });
    if (data?.createPostViaDispatcher?.__typename === 'RelayError') {
      return await createPostTypedData({ variables });
    }

    return;
  };

  const getMainContentFocus = () => {
    if (attachments.length > 0) {
      if (hasAudio) {
        return PublicationMainFocus.Audio;
      } else if (
        ALLOWED_IMAGE_TYPES.includes(attachments[0]?.original.mimeType)
      ) {
        return PublicationMainFocus.Image;
      } else if (hasVideo) {
        return PublicationMainFocus.Video;
      } else {
        return PublicationMainFocus.TextOnly;
      }
    } else {
      return PublicationMainFocus.TextOnly;
    }
  };

  const getAnimationUrl = () => {
    if (attachments.length > 0 && (hasAudio || hasVideo)) {
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

  const getAttachmentImageMimeType = () => {
    return hasAudio
      ? audioPublication.coverMimeType
      : attachments[0]?.original.mimeType;
  };

  const getTitlePrefix = () => {
    if (hasVideo) {
      return 'Video';
    }

    return isComment ? 'Comment' : 'Post';
  };

  const createTokenGatedMetadata = async (
    metadata: PublicationMetadataV2Input
  ) => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (!signer) {
      return toast.error(Errors.SignWallet);
    }

    // Create the SDK instance
    const tokenGatedSdk = await LensGatedSDK.create({
      provider: provider as any,
      signer,
      env: LIT_PROTOCOL_ENVIRONMENT as LensEnvironment
    });

    // Connect to the SDK
    await tokenGatedSdk.connect({
      address: currentProfile.ownedBy,
      env: LIT_PROTOCOL_ENVIRONMENT as LensEnvironment
    });

    // Condition for gating the content
    const collectAccessCondition: CollectCondition = { thisPublication: true };
    const followAccessCondition: FollowCondition = {
      profileId: currentProfile.id
    };

    // Create the access condition
    let accessCondition: AccessConditionOutput = {};
    if (collectToView && followToView) {
      accessCondition = {
        and: {
          criteria: [
            { collect: collectAccessCondition },
            { follow: followAccessCondition }
          ]
        }
      };
    } else if (collectToView) {
      accessCondition = { collect: collectAccessCondition };
    } else if (followToView) {
      accessCondition = { follow: followAccessCondition };
    }

    // Generate the encrypted metadata and upload it to Arweave
    const { contentURI } = await tokenGatedSdk.gated.encryptMetadata(
      metadata,
      currentProfile.id,
      accessCondition,
      async (data: EncryptedMetadata) => {
        return await uploadToArweave(data);
      }
    );

    return contentURI;
  };

  const createMetadata = async (metadata: PublicationMetadataV2Input) => {
    return await uploadToArweave(metadata);
  };

  const createPublication = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (isComment && publication.isDataAvailability && !isSponsored) {
      return toast.error(
        t`Your profile is not allowed to comment on this post`
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
      if (
        !attachments.length &&
        selectedCollectModule !== CollectModules.RevertCollectModule
      ) {
        textNftImageUrl = await getTextNftUrl(
          publicationContent,
          currentProfile.handle,
          new Date().toLocaleString()
        );
      }

      const attributes: MetadataAttributeInput[] = [
        {
          traitType: 'type',
          displayType: PublicationMetadataDisplayTypes.String,
          value: getMainContentFocus()?.toLowerCase()
        },
        ...(hasVideo
          ? [
              {
                traitType: 'durationInSeconds',
                displayType: PublicationMetadataDisplayTypes.String,
                value: videoDurationInSeconds
              }
            ]
          : [])
      ];

      if (hasAudio) {
        attributes.push({
          traitType: 'author',
          displayType: PublicationMetadataDisplayTypes.String,
          value: audioPublication.author
        });
      }

      const attachmentsInput: PublicationMetadataMediaInput[] = attachments.map(
        (attachment) => ({
          item: attachment.original.url,
          type: attachment.original.mimeType,
          altTag: attachment.original.altTag
        })
      );

      let processedPublicationContent = publicationContent;

      if (showPollEditor) {
        processedPublicationContent = await createPoll();
      }

      const metadata: PublicationMetadataV2Input = {
        version: '2.0.0',
        metadata_id: uuid(),
        content: processedPublicationContent,
        external_url: `https://lenster.xyz/u/${currentProfile?.handle}`,
        image:
          attachmentsInput.length > 0 ? getAttachmentImage() : textNftImageUrl,
        imageMimeType:
          attachmentsInput.length > 0
            ? getAttachmentImageMimeType()
            : textNftImageUrl
            ? 'image/svg+xml'
            : null,
        name: hasAudio
          ? audioPublication.title
          : `${getTitlePrefix()} by @${currentProfile?.handle}`,
        tags: getTags(publicationContent),
        animation_url: getAnimationUrl(),
        mainContentFocus: getMainContentFocus(),
        contentWarning: null,
        attributes,
        media: attachmentsInput,
        locale: getUserLocale(),
        appId: APP_NAME
      };

      const isRevertCollectModule =
        selectedCollectModule === CollectModules.RevertCollectModule;
      const useDataAvailability =
        !restricted &&
        (isComment
          ? publication.isDataAvailability && isRevertCollectModule
          : isRevertCollectModule);

      let arweaveId = null;
      if (restricted) {
        arweaveId = await createTokenGatedMetadata(metadata);
      } else {
        arweaveId = await createMetadata(metadata);
      }

      // Payload for the post/comment
      const request: CreatePublicPostRequest | CreatePublicCommentRequest = {
        profileId: currentProfile?.id,
        contentURI: `ar://${arweaveId}`,
        ...(isComment && {
          publicationId:
            publication.__typename === 'Mirror'
              ? publication?.mirrorOf?.id
              : publication?.id
        }),
        collectModule: payload,
        referenceModule:
          selectedReferenceModule ===
          ReferenceModules.FollowerOnlyReferenceModule
            ? { followerOnlyReferenceModule: onlyFollowers ? true : false }
            : {
                degreesOfSeparationReferenceModule: {
                  commentsRestricted: true,
                  mirrorsRestricted: true,
                  degreesOfSeparation
                }
              }
      };

      // Payload for the data availability post/comment
      const dataAvailablityRequest = {
        from: currentProfile?.id,
        ...(isComment && {
          commentOn:
            publication.__typename === 'Mirror'
              ? publication?.mirrorOf?.id
              : publication?.id
        }),
        contentURI: `ar://${arweaveId}`
      };

      if (canUseRelay) {
        if (useDataAvailability && isSponsored) {
          return await createViaDataAvailablityDispatcher(
            dataAvailablityRequest
          );
        }

        return await createViaDispatcher(request);
      }

      if (isComment) {
        return await createCommentTypedData({
          variables: {
            options: { overrideSigNonce: userSigNonce },
            request: request as CreatePublicCommentRequest
          }
        });
      }

      return await createPostTypedData({
        variables: { options: { overrideSigNonce: userSigNonce }, request }
      });
    } catch {}
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

  return (
    <Card
      className={clsx(
        { '!rounded-b-xl !rounded-t-none border-none': !isComment },
        'pb-3'
      )}
    >
      {error && (
        <ErrorMessage
          className="!rounded-none"
          title={t`Transaction failed!`}
          error={error}
        />
      )}
      <Editor />
      {publicationContentError && (
        <div className="mt-1 px-5 pb-3 text-sm font-bold text-red-500">
          {publicationContentError}
        </div>
      )}
      {showPollEditor && <PollEditor />}
      <div className="block items-center px-5 sm:flex">
        <div className="flex items-center space-x-4">
          <Attachment />
          <Giphy setGifAttachment={(gif: IGif) => setGifAttachment(gif)} />
          {!publication?.isDataAvailability && (
            <>
              <CollectSettings />
              <ReferenceSettings />
              <AccessSettings />
            </>
          )}
          <PollSettings />
        </div>
        <div className="ml-auto pt-2 sm:pt-0">
          <Button
            disabled={isLoading || isUploading || videoThumbnail.uploading}
            icon={
              isLoading ? (
                <Spinner size="xs" />
              ) : isComment ? (
                <ChatAlt2Icon className="h-4 w-4" />
              ) : (
                <PencilAltIcon className="h-4 w-4" />
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
    </Card>
  );
};

export default withLexicalContext(NewPublication);
