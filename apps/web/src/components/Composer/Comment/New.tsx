import Attachments from '@components/Shared/Attachments';
import { AudioPublicationSchema } from '@components/Shared/Audio';
import withLexicalContext from '@components/Shared/Lexical/withLexicalContext';
import { Button } from '@components/UI/Button';
import { Card } from '@components/UI/Card';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import useBroadcast from '@components/utils/hooks/useBroadcast';
import type { LensterAttachment, LensterPublication } from '@generated/types';
import type { IGif } from '@giphy/js-types';
import { ChatAlt2Icon } from '@heroicons/react/outline';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import getSignature from '@lib/getSignature';
import getTags from '@lib/getTags';
import getTextNftUrl from '@lib/getTextNftUrl';
import getUserLocale from '@lib/getUserLocale';
import { Leafwatch } from '@lib/leafwatch';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import trimify from '@lib/trimify';
import uploadToArweave from '@lib/uploadToArweave';
import { LensHubProxy } from 'abis';
import {
  ALLOWED_AUDIO_TYPES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  APP_NAME,
  LENSHUB_PROXY,
  RELAY_ON,
  SIGN_WALLET
} from 'data/constants';
import type { CreatePublicCommentRequest } from 'lens';
import {
  PublicationMainFocus,
  ReferenceModules,
  useCreateCommentTypedDataMutation,
  useCreateCommentViaDispatcherMutation
} from 'lens';
import { $getRoot } from 'lexical';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { useCollectModuleStore } from 'src/store/collect-module';
import { usePublicationStore } from 'src/store/publication';
import { useReferenceModuleStore } from 'src/store/reference-module';
import { useTransactionPersistStore } from 'src/store/transaction';
import { COMMENT } from 'src/tracking';
import { v4 as uuid } from 'uuid';
import { useContractWrite, useSignTypedData } from 'wagmi';

import Editor from '../Editor';

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

const NewComment: FC<Props> = ({ publication }) => {
  // App store
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Publication store
  const publicationContent = usePublicationStore((state) => state.publicationContent);
  const setPublicationContent = usePublicationStore((state) => state.setPublicationContent);
  const audioPublication = usePublicationStore((state) => state.audioPublication);

  // Transaction persist store
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const setTxnQueue = useTransactionPersistStore((state) => state.setTxnQueue);

  // Collect module store
  const payload = useCollectModuleStore((state) => state.payload);
  const resetCollectSettings = useCollectModuleStore((state) => state.reset);

  // Reference module store
  const selectedReferenceModule = useReferenceModuleStore((state) => state.selectedReferenceModule);
  const onlyFollowers = useReferenceModuleStore((state) => state.onlyFollowers);
  const degreesOfSeparation = useReferenceModuleStore((state) => state.degreesOfSeparation);

  // States
  const [commentContentError, setCommentContentError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState<LensterAttachment[]>([]);
  const [editor] = useLexicalComposerContext();

  const isAudioComment = ALLOWED_AUDIO_TYPES.includes(attachments[0]?.type);

  const onCompleted = () => {
    editor.update(() => {
      $getRoot().clear();
    });
    setPublicationContent('');
    setAttachments([]);
    resetCollectSettings();
    Leafwatch.track(COMMENT.NEW);
  };

  useEffect(() => {
    setCommentContentError('');
  }, [audioPublication]);

  const generateOptimisticComment = ({ txHash, txId }: { txHash?: string; txId?: string }) => {
    return {
      id: uuid(),
      parent: publication.id,
      type: 'NEW_COMMENT',
      txHash,
      txId,
      content: publicationContent,
      attachments,
      title: audioPublication.title,
      cover: audioPublication.cover,
      author: audioPublication.author
    };
  };

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const {
    error,
    isLoading: writeLoading,
    write
  } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHubProxy,
    functionName: 'commentWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: ({ hash }) => {
      onCompleted();
      setTxnQueue([generateOptimisticComment({ txHash: hash }), ...txnQueue]);
    },
    onError
  });

  const { broadcast, loading: broadcastLoading } = useBroadcast({
    onCompleted: (data) => {
      onCompleted();
      setTxnQueue([generateOptimisticComment({ txId: data?.broadcast?.txId }), ...txnQueue]);
    }
  });
  const [createCommentTypedData, { loading: typedDataLoading }] = useCreateCommentTypedDataMutation({
    onCompleted: async ({ createCommentTypedData }) => {
      try {
        const { id, typedData } = createCommentTypedData;
        const {
          profileId,
          profileIdPointed,
          pubIdPointed,
          contentURI,
          collectModule,
          collectModuleInitData,
          referenceModule,
          referenceModuleData,
          referenceModuleInitData,
          deadline
        } = typedData.value;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { v, r, s } = splitSignature(signature);
        const sig = { v, r, s, deadline };
        const inputStruct = {
          profileId,
          profileIdPointed,
          pubIdPointed,
          contentURI,
          collectModule,
          collectModuleInitData,
          referenceModule,
          referenceModuleData,
          referenceModuleInitData,
          sig
        };

        setUserSigNonce(userSigNonce + 1);
        if (!RELAY_ON) {
          return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
        }

        const {
          data: { broadcast: result }
        } = await broadcast({ request: { id, signature } });

        if ('reason' in result) {
          write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
        }
      } catch {}
    },
    onError
  });

  const [createCommentViaDispatcher, { loading: dispatcherLoading }] = useCreateCommentViaDispatcherMutation({
    onCompleted: (data) => {
      onCompleted();
      if (data.createCommentViaDispatcher.__typename === 'RelayerResult') {
        setTxnQueue([generateOptimisticComment({ txId: data.createCommentViaDispatcher.txId }), ...txnQueue]);
      }
    },
    onError
  });

  const createViaDispatcher = async (request: CreatePublicCommentRequest) => {
    const { data } = await createCommentViaDispatcher({
      variables: { request }
    });
    if (data?.createCommentViaDispatcher?.__typename === 'RelayError') {
      createCommentTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request
        }
      });
    }
  };

  const getMainContentFocus = () => {
    if (attachments.length > 0) {
      if (isAudioComment) {
        return PublicationMainFocus.Audio;
      } else if (ALLOWED_IMAGE_TYPES.includes(attachments[0]?.type)) {
        return PublicationMainFocus.Image;
      } else if (ALLOWED_VIDEO_TYPES.includes(attachments[0]?.type)) {
        return PublicationMainFocus.Video;
      }
    } else {
      return PublicationMainFocus.TextOnly;
    }
  };

  const getAnimationUrl = () => {
    if (attachments.length > 0 && (isAudioComment || ALLOWED_VIDEO_TYPES.includes(attachments[0]?.type))) {
      return attachments[0]?.item;
    }
    return null;
  };

  const getAttachmentImage = () => {
    return isAudioComment ? audioPublication.cover : attachments[0]?.item;
  };

  const getAttachmentImageMimeType = () => {
    return isAudioComment ? audioPublication.coverMimeType : attachments[0]?.type;
  };

  const createComment = async () => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    if (isAudioComment) {
      setCommentContentError('');
      const parsedData = AudioPublicationSchema.safeParse(audioPublication);
      if (!parsedData.success) {
        const issue = parsedData.error.issues[0];
        return setCommentContentError(issue.message);
      }
    }

    if (publicationContent.length === 0 && attachments.length === 0) {
      return setCommentContentError('Comment should not be empty!');
    }

    setCommentContentError('');
    setIsUploading(true);

    let textNftImageUrl = null;
    if (!attachments.length) {
      textNftImageUrl = await getTextNftUrl(
        publicationContent,
        currentProfile.handle,
        new Date().toLocaleString()
      );
    }

    const attributes = [
      {
        traitType: 'type',
        displayType: 'string',
        value: getMainContentFocus()?.toLowerCase()
      }
    ];
    if (isAudioComment) {
      attributes.push({
        traitType: 'author',
        displayType: 'string',
        value: audioPublication.author
      });
    }

    const id = await uploadToArweave({
      version: '2.0.0',
      metadata_id: uuid(),
      description: trimify(publicationContent),
      content: trimify(publicationContent),
      external_url: `https://lenster.xyz/u/${currentProfile?.handle}`,
      image: attachments.length > 0 ? getAttachmentImage() : textNftImageUrl,
      imageMimeType: attachments.length > 0 ? getAttachmentImageMimeType() : 'image/svg+xml',
      name: isAudioComment ? audioPublication.title : `Comment by @${currentProfile?.handle}`,
      tags: getTags(publicationContent),
      animation_url: getAnimationUrl(),
      mainContentFocus: getMainContentFocus(),
      contentWarning: null,
      attributes,
      media: attachments,
      locale: getUserLocale(),
      createdOn: new Date(),
      appId: APP_NAME
    }).finally(() => setIsUploading(false));

    const request = {
      profileId: currentProfile?.id,
      publicationId: publication.__typename === 'Mirror' ? publication?.mirrorOf?.id : publication?.id,
      contentURI: `https://arweave.net/${id}`,
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
      createViaDispatcher(request);
    } else {
      createCommentTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request
        }
      });
    }
  };

  const setGifAttachment = (gif: IGif) => {
    const attachment = {
      item: gif.images.original.url,
      type: 'image/gif',
      altTag: gif.title
    };
    setAttachments([...attachments, attachment]);
  };

  const isLoading =
    isUploading || typedDataLoading || dispatcherLoading || signLoading || writeLoading || broadcastLoading;

  return (
    <Card className="pb-3">
      {error && <ErrorMessage className="mb-3" title="Transaction failed!" error={error} />}
      <Editor />
      {commentContentError && (
        <div className="px-5 pb-3 mt-1 text-sm font-bold text-red-500">{commentContentError}</div>
      )}
      <div className="block items-center sm:flex px-5">
        <div className="flex items-center space-x-4">
          <Attachment attachments={attachments} setAttachments={setAttachments} />
          <Giphy setGifAttachment={(gif: IGif) => setGifAttachment(gif)} />
          <CollectSettings />
          <ReferenceSettings />
          <AccessSettings />
        </div>
        <div className="ml-auto pt-2 sm:pt-0">
          <Button
            disabled={isLoading}
            icon={isLoading ? <Spinner size="xs" /> : <ChatAlt2Icon className="w-4 h-4" />}
            onClick={createComment}
          >
            Comment
          </Button>
        </div>
      </div>
      <div className="px-5">
        <Attachments attachments={attachments} setAttachments={setAttachments} isNew />
      </div>
    </Card>
  );
};

export default withLexicalContext(NewComment);
