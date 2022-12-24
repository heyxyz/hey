import Attachments from '@components/Shared/Attachments';
import { AudioPublicationSchema } from '@components/Shared/Audio';
import withLexicalContext from '@components/Shared/Lexical/withLexicalContext';
import { Button } from '@components/UI/Button';
import { Card } from '@components/UI/Card';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import type { LensterAttachment, LensterPublication } from '@generated/types';
import type { IGif } from '@giphy/js-types';
import { ChatAlt2Icon, PencilAltIcon } from '@heroicons/react/outline';
import type { CollectCondition, EncryptedMetadata, FollowCondition } from '@lens-protocol/sdk-gated';
import { LensGatedSDK } from '@lens-protocol/sdk-gated';
import type { AccessConditionOutput } from '@lens-protocol/sdk-gated/dist/graphql/types';
import { $convertFromMarkdownString } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Analytics } from '@lib/analytics';
import getSignature from '@lib/getSignature';
import getTags from '@lib/getTags';
import getTextNftUrl from '@lib/getTextNftUrl';
import getUserLocale from '@lib/getUserLocale';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import uploadToArweave from '@lib/uploadToArweave';
import { LensHubProxy } from 'abis';
import clsx from 'clsx';
import {
  ALLOWED_AUDIO_TYPES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  APP_NAME,
  LENSHUB_PROXY,
  LIT_PROTOCOL_ENVIRONMENT,
  SIGN_WALLET
} from 'data/constants';
import type { CreatePublicCommentRequest, MetadataAttributeInput, PublicationMetadataV2Input } from 'lens';
import {
  CollectModules,
  PublicationMainFocus,
  PublicationMetadataDisplayTypes,
  ReferenceModules,
  useBroadcastMutation,
  useCreateCommentTypedDataMutation,
  useCreateCommentViaDispatcherMutation,
  useCreatePostTypedDataMutation,
  useCreatePostViaDispatcherMutation
} from 'lens';
import { $getRoot } from 'lexical';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAccessSettingsStore } from 'src/store/access-settings';
import { useAppStore } from 'src/store/app';
import { useCollectModuleStore } from 'src/store/collect-module';
import { usePublicationStore } from 'src/store/publication';
import { useReferenceModuleStore } from 'src/store/reference-module';
import { useTransactionPersistStore } from 'src/store/transaction';
import { COMMENT, POST } from 'src/tracking';
import { v4 as uuid } from 'uuid';
import { useContractWrite, useProvider, useSigner, useSignTypedData } from 'wagmi';

import Editor from './Editor';

const Attachment = dynamic(() => import('@components/Composer/Actions/Attachment'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});
const Giphy = dynamic(() => import('@components/Composer/Actions/Giphy'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});
const CollectSettings = dynamic(() => import('@components/Composer/Actions/CollectSettings'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});
const ReferenceSettings = dynamic(() => import('@components/Composer/Actions/ReferenceSettings'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});
const AccessSettings = dynamic(() => import('@components/Composer/Actions/AccessSettings'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});

interface Props {
  publication: LensterPublication;
}

const NewPublication: FC<Props> = ({ publication }) => {
  // App store
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Publication store
  const publicationContent = usePublicationStore((state) => state.publicationContent);
  const setPublicationContent = usePublicationStore((state) => state.setPublicationContent);
  const audioPublication = usePublicationStore((state) => state.audioPublication);
  const setShowNewPostModal = usePublicationStore((state) => state.setShowNewPostModal);
  const attachments = usePublicationStore((state) => state.attachments);
  const setAttachments = usePublicationStore((state) => state.setAttachments);
  const addAttachments = usePublicationStore((state) => state.addAttachments);
  const isUploading = usePublicationStore((state) => state.isUploading);

  // Transaction persist store
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const setTxnQueue = useTransactionPersistStore((state) => state.setTxnQueue);

  // Collect module store
  const selectedCollectModule = useCollectModuleStore((state) => state.selectedCollectModule);
  const payload = useCollectModuleStore((state) => state.payload);
  const resetCollectSettings = useCollectModuleStore((state) => state.reset);

  // Reference module store
  const selectedReferenceModule = useReferenceModuleStore((state) => state.selectedReferenceModule);
  const onlyFollowers = useReferenceModuleStore((state) => state.onlyFollowers);
  const degreesOfSeparation = useReferenceModuleStore((state) => state.degreesOfSeparation);

  // Access module store
  const restricted = useAccessSettingsStore((state) => state.restricted);
  const followToView = useAccessSettingsStore((state) => state.followToView);
  const collectToView = useAccessSettingsStore((state) => state.collectToView);
  const resetAccessSettings = useAccessSettingsStore((state) => state.reset);

  // States
  const [loading, setLoading] = useState(false);
  const [publicationContentError, setPublicationContentError] = useState('');
  const [editor] = useLexicalComposerContext();
  const provider = useProvider();
  const { data: signer } = useSigner();

  const isComment = Boolean(publication);
  const isAudioPublication = ALLOWED_AUDIO_TYPES.includes(attachments[0]?.type);

  const onCompleted = () => {
    editor.update(() => {
      $getRoot().clear();
    });
    setPublicationContent('');
    setAttachments([]);
    resetCollectSettings();
    resetAccessSettings();
    if (!isComment) {
      setShowNewPostModal(false);
    }

    // Track in simple analytics
    if (restricted) {
      Analytics.track(isComment ? COMMENT.TOKEN_GATED : POST.TOKEN_GATED);
    } else {
      Analytics.track(isComment ? COMMENT.NEW : POST.NEW);
    }
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

  const generateOptimisticPublication = ({ txHash, txId }: { txHash?: string; txId?: string }) => {
    return {
      id: uuid(),
      ...(isComment && { parent: publication.id }),
      type: isComment ? 'NEW_COMMENT' : 'NEW_POST',
      txHash,
      txId,
      content: publicationContent,
      attachments,
      title: audioPublication.title,
      cover: audioPublication.cover,
      author: audioPublication.author
    };
  };

  const { signTypedDataAsync, isLoading: typedDataLoading } = useSignTypedData({ onError });

  const { error, write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHubProxy,
    functionName: isComment ? 'commentWithSig' : 'postWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: ({ hash }) => {
      onCompleted();
      setTxnQueue([generateOptimisticPublication({ txHash: hash }), ...txnQueue]);
    },
    onError
  });

  const [broadcast] = useBroadcastMutation({
    onCompleted: (data) => {
      onCompleted();
      if (data.broadcast.__typename === 'RelayerResult') {
        setTxnQueue([generateOptimisticPublication({ txId: data.broadcast.txId }), ...txnQueue]);
      }
    }
  });

  const typedDataGenerator = async (generatedData: any) => {
    const { id, typedData } = generatedData;
    const {
      profileId,
      contentURI,
      collectModule,
      collectModuleInitData,
      referenceModule,
      referenceModuleInitData,
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
      ...(isComment && {
        profileIdPointed: typedData.value.profileIdPointed,
        pubIdPointed: typedData.value.pubIdPointed
      }),
      sig
    };
    setUserSigNonce(userSigNonce + 1);
    const { data } = await broadcast({ variables: { request: { id, signature } } });
    if (data?.broadcast.__typename === 'RelayError') {
      return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
    }
  };

  const [createCommentTypedData] = useCreateCommentTypedDataMutation({
    onCompleted: async ({ createCommentTypedData }) => await typedDataGenerator(createCommentTypedData),
    onError
  });

  const [createPostTypedData] = useCreatePostTypedDataMutation({
    onCompleted: async ({ createPostTypedData }) => await typedDataGenerator(createPostTypedData),
    onError
  });

  const [createCommentViaDispatcher] = useCreateCommentViaDispatcherMutation({
    onCompleted: (data) => {
      onCompleted();
      if (data.createCommentViaDispatcher.__typename === 'RelayerResult') {
        setTxnQueue([
          generateOptimisticPublication({ txId: data.createCommentViaDispatcher.txId }),
          ...txnQueue
        ]);
      }
    },
    onError
  });

  const [createPostViaDispatcher] = useCreatePostViaDispatcherMutation({
    onCompleted: (data) => {
      onCompleted();
      if (data.createPostViaDispatcher.__typename === 'RelayerResult') {
        setTxnQueue([
          generateOptimisticPublication({ txId: data.createPostViaDispatcher.txId }),
          ...txnQueue
        ]);
      }
    },
    onError
  });

  const createViaDispatcher = async (request: any) => {
    const variables = {
      options: { overrideSigNonce: userSigNonce },
      request
    };

    if (isComment) {
      const { data } = await createCommentViaDispatcher({ variables: { request } });
      if (data?.createCommentViaDispatcher?.__typename === 'RelayError') {
        return await createCommentTypedData({ variables });
      }
    }

    const { data } = await createPostViaDispatcher({ variables: { request } });
    if (data?.createPostViaDispatcher?.__typename === 'RelayError') {
      return await createPostTypedData({ variables });
    }
  };

  const getMainContentFocus = () => {
    if (attachments.length > 0) {
      if (isAudioPublication) {
        return PublicationMainFocus.Audio;
      } else if (ALLOWED_IMAGE_TYPES.includes(attachments[0]?.type)) {
        return PublicationMainFocus.Image;
      } else if (ALLOWED_VIDEO_TYPES.includes(attachments[0]?.type)) {
        return PublicationMainFocus.Video;
      } else {
        return PublicationMainFocus.TextOnly;
      }
    } else {
      return PublicationMainFocus.TextOnly;
    }
  };

  const getAnimationUrl = () => {
    if (
      attachments.length > 0 &&
      (isAudioPublication || ALLOWED_VIDEO_TYPES.includes(attachments[0]?.type))
    ) {
      return attachments[0]?.item;
    }

    return null;
  };

  const getAttachmentImage = () => {
    return isAudioPublication ? audioPublication.cover : attachments[0]?.item;
  };

  const getAttachmentImageMimeType = () => {
    return isAudioPublication ? audioPublication.coverMimeType : attachments[0]?.type;
  };

  const createTokenGatedMetadata = async (metadata: PublicationMetadataV2Input) => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    if (!signer) {
      return toast.error(SIGN_WALLET);
    }

    // Create the SDK instance
    const tokenGatedSdk = await LensGatedSDK.create({
      provider,
      signer,
      env: LIT_PROTOCOL_ENVIRONMENT as any
    });

    // Connect to the SDK
    await tokenGatedSdk.connect({
      address: currentProfile.ownedBy,
      env: LIT_PROTOCOL_ENVIRONMENT as any
    });

    // Condition for gating the content
    const collectAccessCondition: CollectCondition = { thisPublication: true };
    const followAccessCondition: FollowCondition = { profileId: currentProfile.id };

    // Create the access condition
    let accessCondition: AccessConditionOutput = {};
    if (collectToView && followToView) {
      accessCondition = {
        and: { criteria: [{ collect: collectAccessCondition }, { follow: followAccessCondition }] }
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
      return toast.error(SIGN_WALLET);
    }

    try {
      setLoading(true);
      if (isAudioPublication) {
        setPublicationContentError('');
        const parsedData = AudioPublicationSchema.safeParse(audioPublication);
        if (!parsedData.success) {
          const issue = parsedData.error.issues[0];
          return setPublicationContentError(issue.message);
        }
      }

      if (publicationContent.length === 0 && attachments.length === 0) {
        return setPublicationContentError(`${isComment ? 'Comment' : 'Post'} should not be empty!`);
      }

      setPublicationContentError('');
      let textNftImageUrl = null;
      if (!attachments.length && selectedCollectModule !== CollectModules.RevertCollectModule) {
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
        }
      ];

      if (isAudioPublication) {
        attributes.push({
          traitType: 'author',
          displayType: PublicationMetadataDisplayTypes.String,
          value: audioPublication.author
        });
      }

      const attachmentsInput: LensterAttachment[] = attachments.map((attachment) => ({
        type: attachment.type,
        altTag: attachment.altTag,
        item: attachment.item!
      }));

      const metadata: PublicationMetadataV2Input = {
        version: '2.0.0',
        metadata_id: uuid(),
        description: publicationContent,
        content: publicationContent,
        external_url: `https://lenster.xyz/u/${currentProfile?.handle}`,
        image: attachmentsInput.length > 0 ? getAttachmentImage() : textNftImageUrl,
        imageMimeType: attachmentsInput.length > 0 ? getAttachmentImageMimeType() : 'image/svg+xml',
        name: isAudioPublication
          ? audioPublication.title
          : `${isComment ? 'Comment' : 'Post'} by @${currentProfile?.handle}`,
        tags: getTags(publicationContent),
        animation_url: getAnimationUrl(),
        mainContentFocus: getMainContentFocus(),
        contentWarning: null,
        attributes,
        media: attachmentsInput,
        locale: getUserLocale(),
        appId: APP_NAME
      };

      let arweaveId = null;
      if (restricted) {
        arweaveId = await createTokenGatedMetadata(metadata);
      } else {
        arweaveId = await createMetadata(metadata);
      }

      const request = {
        profileId: currentProfile?.id,
        contentURI: `https://arweave.net/${arweaveId}`,
        ...(isComment && {
          publicationId: publication.__typename === 'Mirror' ? publication?.mirrorOf?.id : publication?.id
        }),
        collectModule: payload,
        referenceModule:
          selectedReferenceModule === ReferenceModules.FollowerOnlyReferenceModule
            ? { followerOnlyReferenceModule: onlyFollowers ? true : false }
            : {
                degreesOfSeparationReferenceModule: {
                  commentsRestricted: true,
                  mirrorsRestricted: true,
                  degreesOfSeparation
                }
              }
      };

      if (currentProfile?.dispatcher?.canUseRelay) {
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
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const setGifAttachment = (gif: IGif) => {
    const attachment = {
      id: uuid(),
      item: gif.images.original.url,
      type: 'image/gif',
      altTag: gif.title
    };
    addAttachments([attachment]);
  };

  const isLoading = loading || typedDataLoading;

  return (
    <Card className={clsx({ 'border-none rounded-none': !isComment }, 'pb-3')}>
      {error && <ErrorMessage className="mb-3" title="Transaction failed!" error={error} />}
      <Editor />
      {publicationContentError && (
        <div className="px-5 pb-3 mt-1 text-sm font-bold text-red-500">{publicationContentError}</div>
      )}
      <div className="block items-center sm:flex px-5">
        <div className="flex items-center space-x-4">
          <Attachment />
          <Giphy setGifAttachment={(gif: IGif) => setGifAttachment(gif)} />
          <CollectSettings />
          <ReferenceSettings />
          <AccessSettings />
        </div>
        <div className="ml-auto pt-2 sm:pt-0">
          <Button
            disabled={isLoading || isUploading}
            icon={
              isLoading ? (
                <Spinner size="xs" />
              ) : isComment ? (
                <ChatAlt2Icon className="w-4 h-4" />
              ) : (
                <PencilAltIcon className="w-4 h-4" />
              )
            }
            onClick={createPublication}
          >
            {isComment ? 'Comment' : 'Post'}
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
