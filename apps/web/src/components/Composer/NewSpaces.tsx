import Attachments from '@components/Shared/Attachments';
import { AudioPublicationSchema } from '@components/Shared/Audio';
import withLexicalContext from '@components/Shared/Lexical/withLexicalContext';
import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import { MicrophoneIcon } from '@heroicons/react/outline';
import { ChevronDownIcon } from '@heroicons/react/solid';
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
import { LensHub } from '@lenster/abis';
import {
  ALLOWED_AUDIO_TYPES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  APP_NAME,
  LENSHUB_PROXY,
  LIT_PROTOCOL_ENVIRONMENT
} from '@lenster/data/constants';
import { Errors } from '@lenster/data/errors';
import { PUBLICATION } from '@lenster/data/tracking';
import type {
  CreatePublicCommentRequest,
  MetadataAttributeInput,
  Publication,
  PublicationMetadataMediaInput,
  PublicationMetadataV2Input
} from '@lenster/lens';
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
} from '@lenster/lens';
import { useApolloClient } from '@lenster/lens/apollo';
import getSignature from '@lenster/lib/getSignature';
import {
  Button,
  Card,
  ErrorMessage,
  Image,
  Input,
  Spinner,
  Toggle
} from '@lenster/ui';
import { $convertFromMarkdownString } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import collectModuleParams from '@lib/collectModuleParams';
import errorToast from '@lib/errorToast';
import getTextNftUrl from '@lib/getTextNftUrl';
import getUserLocale from '@lib/getUserLocale';
import { Leafwatch } from '@lib/leafwatch';
import uploadToArweave from '@lib/uploadToArweave';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import { $getRoot } from 'lexical';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { OptmisticPublicationType } from 'src/enums';
import { useAccessSettingsStore } from 'src/store/access-settings';
import { useAppStore } from 'src/store/app';
import { useCollectModuleStore } from 'src/store/collect-module';
import { useGlobalModalStateStore } from 'src/store/modals';
import { useNonceStore } from 'src/store/nonce';
import { usePublicationStore } from 'src/store/publication';
import { useReferenceModuleStore } from 'src/store/reference-module';
import { useTransactionPersistStore } from 'src/store/transaction';
import { useEffectOnce } from 'usehooks-ts';
import { v4 as uuid } from 'uuid';
import { useContractWrite, usePublicClient, useSignTypedData } from 'wagmi';

import useCreatePoll from '../../hooks/useCreatePoll';
import useCreateSpace from '../../hooks/useCreateSpace';
import useEthersWalletClient from '../../hooks/useEthersWalletClient';
import Editor from './Editor';

interface NewPublicationProps {
  publication: Publication;
}

const NewPublication: FC<NewPublicationProps> = ({ publication }) => {
  const { push } = useRouter();
  const { cache } = useApolloClient();
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Modal store
  const setShowNewSpacesModal = useGlobalModalStateStore(
    (state) => state.setShowNewSpacesModal
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
    videoThumbnail,
    videoDurationInSeconds,
    showPollEditor,
    showSpaceEditor,
    setShowSpaceEditor
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

  // Access module store
  const {
    restricted,
    followToView,
    collectToView,
    reset: resetAccessSettings
  } = useAccessSettingsStore();

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [publicationContentError, setPublicationContentError] = useState('');
  const [isRecordingOn, setIsRecordingOn] = useState(false);
  const [isTokenGated, setIsTokenGated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDropdown, setSelectedDropdown] = useState<string>('');

  const [editor] = useLexicalComposerContext();
  const publicClient = usePublicClient();
  const { data: walletClient } = useEthersWalletClient();
  const [createPoll] = useCreatePoll();
  const [createSpace] = useCreateSpace();

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
    setQuotedPublication(null);
    setShowSpaceEditor(false);
    setShowNewSpacesModal(false);

    // Track in leafwatch
    const eventProperties = {
      publication_type: restricted ? 'token_gated' : 'public',
      publication_collect_module: collectModule.type,
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
    isDataAvailabilityPublication = false
  ) => {
    const { id, typedData } = generatedData;
    const signature = await signTypedDataAsync(getSignature(typedData));
    if (isDataAvailabilityPublication) {
      return await broadcastDataAvailability({
        variables: { request: { id, signature } }
      });
    }

    const { data } = await broadcast({
      variables: { request: { id, signature } }
    });
    if (data?.broadcast.__typename === 'RelayError') {
      return write({ args: [typedData.value] });
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

    if (!walletClient) {
      return toast.error(Errors.SignWallet);
    }

    // Create the SDK instance
    const tokenGatedSdk = await LensGatedSDK.create({
      provider: publicClient as any,
      signer: walletClient as any,
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
      if (
        !attachments.length &&
        collectModule.type !== CollectModules.RevertCollectModule
      ) {
        textNftImageUrl = await getTextNftUrl(
          publicationContent,
          currentProfile.handle,
          new Date().toLocaleString()
        );
      }

      // Create Space in Huddle
      let spaceId = null;
      if (showSpaceEditor) {
        spaceId = await createSpace();
      }

      const attributes: MetadataAttributeInput[] = [
        {
          traitType: 'type',
          displayType: PublicationMetadataDisplayTypes.String,
          value: getMainContentFocus()?.toLowerCase()
        },
        ...(showSpaceEditor
          ? [
              {
                traitType: 'audioSpace',
                displayType: PublicationMetadataDisplayTypes.String,
                value: JSON.stringify({
                  id: spaceId,
                  host: currentProfile.ownedBy
                })
              }
            ]
          : []),
        ...(quotedPublication
          ? [
              {
                traitType: 'quotedPublicationId',
                displayType: PublicationMetadataDisplayTypes.String,
                value: quotedPublication.id
              }
            ]
          : [])
      ];

      const attachmentsInput: PublicationMetadataMediaInput[] = attachments.map(
        (attachment) => ({
          item: attachment.original.url,
          cover: getAttachmentImage(),
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
        animation_url: getAnimationUrl(),
        mainContentFocus: getMainContentFocus(),
        attributes,
        media: attachmentsInput,
        locale: getUserLocale(),
        appId: APP_NAME
      };

      const isRevertCollectModule =
        collectModule.type === CollectModules.RevertCollectModule;
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
        collectModule: collectModuleParams(collectModule, currentProfile),
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
    } catch (error) {
      onError(error);
    }
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
      {selectedDropdown.length > 0 &&
        selectedDropdown !== 'have a lens profile' && (
          <div className="flex w-full items-center gap-2 border-t border-neutral-200 px-4 py-3 dark:border-neutral-800">
            <div className="flex items-center gap-3 text-neutral-500">
              {selectedDropdown === 'follow a lens profile'
                ? 'Enter Lens profile link'
                : 'Enter Lens post link'}
            </div>
            <div className="flex flex-[1_0_0] items-center gap-1 px-3">
              <Input
                placeholder={`Lens ${
                  selectedDropdown === 'follow a lens profile'
                    ? 'profile'
                    : 'post'
                } link`}
                className="placeholder-neutral-400"
              />
            </div>
          </div>
        )}
      <div className="block items-center border-t border-neutral-200 px-5 pt-3 dark:border-neutral-800 sm:flex">
        <div className="flex flex-[0_0_1] gap-2 space-x-1">
          <div>
            <Toggle
              on={isRecordingOn}
              setOn={() => setIsRecordingOn(!isRecordingOn)}
            />
          </div>
          <div className="flex flex-col items-start text-neutral-400 dark:text-neutral-500">
            Record Spaces
          </div>
          <div className="flex items-center justify-center">
            <svg
              width="2"
              height="20"
              viewBox="0 0 2 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 0V20" stroke="#262626" stroke-width="1.5" />
            </svg>
          </div>
          <div>
            <Toggle
              on={isTokenGated}
              setOn={() => setIsTokenGated(!isTokenGated)}
            />
          </div>
          <div className="flex items-start gap-1">
            <div className="flex flex-col items-start text-neutral-400 dark:text-neutral-500">
              Token gate with
            </div>
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-start gap-1">
                <span className="flex items-start gap-1 text-neutral-500 dark:text-neutral-300">
                  {selectedDropdown.length > 0
                    ? selectedDropdown
                    : 'have a lens profile'}
                </span>
                <ChevronDownIcon className="h-6 w-6" />
              </Menu.Button>
              <MenuTransition>
                <Menu.Items
                  className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg focus:outline-none dark:bg-gray-900"
                  style={{ display: isMenuOpen ? 'block' : 'none' }}
                >
                  <Menu.Item
                    as="label"
                    className={({ active }) =>
                      clsx(
                        { 'dropdown-active': active },
                        'flex items-center justify-between gap-3 px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400'
                      )
                    }
                    onClick={() => setSelectedDropdown('have a lens profile')}
                  >
                    <span>have a lens profile</span>
                    {(selectedDropdown === 'have a lens profile' ||
                      selectedDropdown === '') && (
                      <Image
                        src="/check-icon.png"
                        className="relative h-5 w-5"
                      />
                    )}
                  </Menu.Item>
                  <Menu.Item
                    as="label"
                    className={({ active }) =>
                      clsx(
                        { 'dropdown-active': active },
                        'flex items-center justify-between px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400'
                      )
                    }
                    onClick={() => setSelectedDropdown('follow a lens profile')}
                  >
                    <span>follow a lens profile</span>
                    {selectedDropdown === 'follow a lens profile' && (
                      <Image
                        src="/check-icon.png"
                        className="relative h-5 w-5"
                      />
                    )}
                  </Menu.Item>
                  <Menu.Item
                    as="label"
                    className={({ active }) =>
                      clsx(
                        { 'dropdown-active': active },
                        'flex items-center justify-between px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400'
                      )
                    }
                    onClick={() => setSelectedDropdown('collect a post')}
                  >
                    <span>collect a post</span>
                    {selectedDropdown === 'collect a post' && (
                      <Image
                        src="/check-icon.png"
                        className="relative h-5 w-5"
                      />
                    )}
                  </Menu.Item>
                  <Menu.Item
                    as="label"
                    className={({ active }) =>
                      clsx(
                        { 'dropdown-active': active },
                        'flex items-center justify-between px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400'
                      )
                    }
                    onClick={() => setSelectedDropdown('mirror a post')}
                  >
                    <span>mirror a post</span>
                    {selectedDropdown === 'mirror a post' && (
                      <Image
                        src="/check-icon.png"
                        className="relative h-5 w-5"
                      />
                    )}
                  </Menu.Item>
                </Menu.Items>
              </MenuTransition>
            </Menu>
          </div>
        </div>
        <div className="ml-auto pt-2 sm:pt-0">
          <Button
            disabled={isLoading}
            icon={
              isLoading ? (
                <Spinner size="xs" />
              ) : (
                <MicrophoneIcon className="h-4 w-4" />
              )
            }
            onClick={createPublication}
          >
            Create spaces
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
