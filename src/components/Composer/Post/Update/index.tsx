import { LensHubProxy } from '@abis/LensHubProxy';
import { useMutation } from '@apollo/client';
import Attachments from '@components/Shared/Attachments';
import Markup from '@components/Shared/Markup';
import { Button } from '@components/UI/Button';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { MentionTextArea } from '@components/UI/MentionTextArea';
import { Spinner } from '@components/UI/Spinner';
import useBroadcast from '@components/utils/hooks/useBroadcast';
import type { LensterAttachment } from '@generated/lenstertypes';
import type { Mutation } from '@generated/types';
import {
  CreatePostTypedDataDocument,
  CreatePostViaDispatcherDocument,
  PublicationMainFocus,
  ReferenceModules
} from '@generated/types';
import type { IGif } from '@giphy/js-types';
import { PencilAltIcon } from '@heroicons/react/outline';
import { BirdStats } from '@lib/birdstats';
import getSignature from '@lib/getSignature';
import getTags from '@lib/getTags';
import getUserLocale from '@lib/getUserLocale';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import trimify from '@lib/trimify';
import uploadToArweave from '@lib/uploadToArweave';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { APP_NAME, LENSHUB_PROXY, RELAY_ON, SIGN_WALLET } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { useCollectModuleStore } from 'src/store/collectmodule';
import { usePublicationStore } from 'src/store/publication';
import { useReferenceModuleStore } from 'src/store/referencemodule';
import { useTransactionPersistStore } from 'src/store/transaction';
import { POST } from 'src/tracking';
import { v4 as uuid } from 'uuid';
import { useContractWrite, useSignTypedData } from 'wagmi';

const Attachment = dynamic(() => import('@components/Shared/Attachment'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});
const Giphy = dynamic(() => import('@components/Shared/Giphy'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});
const CollectSettings = dynamic(() => import('@components/Shared/CollectSettings'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});
const ReferenceSettings = dynamic(() => import('@components/Shared/ReferenceSettings'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});
const Preview = dynamic(() => import('@components/Shared/Preview'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});

const NewUpdate: FC = () => {
  // App store
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Publication store
  const publicationContent = usePublicationStore((state) => state.publicationContent);
  const setPublicationContent = usePublicationStore((state) => state.setPublicationContent);
  const previewPublication = usePublicationStore((state) => state.previewPublication);
  const setPreviewPublication = usePublicationStore((state) => state.setPreviewPublication);
  const setShowNewPostModal = usePublicationStore((state) => state.setShowNewPostModal);

  // Transaction persist store
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const setTxnQueue = useTransactionPersistStore((state) => state.setTxnQueue);

  // Collect module store
  const resetCollectSettings = useCollectModuleStore((state) => state.reset);
  const payload = useCollectModuleStore((state) => state.payload);

  // Reference module store
  const selectedReferenceModule = useReferenceModuleStore((state) => state.selectedReferenceModule);
  const onlyFollowers = useReferenceModuleStore((state) => state.onlyFollowers);
  const degreesOfSeparation = useReferenceModuleStore((state) => state.degreesOfSeparation);

  // States
  const [postContentError, setPostContentError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState<LensterAttachment[]>([]);
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const onCompleted = () => {
    setPreviewPublication(false);
    setShowNewPostModal(false);
    setPublicationContent('');
    setAttachments([]);
    resetCollectSettings();
    BirdStats.track(POST.NEW);
  };

  const generateOptimisticPost = (txHash: string) => {
    return {
      id: uuid(),
      type: 'NEW_POST',
      txHash,
      content: publicationContent,
      attachments
    };
  };

  const {
    error,
    isLoading: writeLoading,
    write
  } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'postWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: ({ hash }) => {
      onCompleted();
      setTxnQueue([generateOptimisticPost(hash), ...txnQueue]);
    },
    onError
  });

  const { broadcast, loading: broadcastLoading } = useBroadcast({
    onCompleted: (data) => {
      onCompleted();
      setTxnQueue([generateOptimisticPost(data?.broadcast?.txHash), ...txnQueue]);
    }
  });
  const [createPostTypedData, { loading: typedDataLoading }] = useMutation<Mutation>(
    CreatePostTypedDataDocument,
    {
      onCompleted: async ({ createPostTypedData }) => {
        try {
          const { id, typedData } = createPostTypedData;
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
            sig
          };

          setUserSigNonce(userSigNonce + 1);
          if (!RELAY_ON) {
            return write?.({ recklesslySetUnpreparedArgs: inputStruct });
          }

          const {
            data: { broadcast: result }
          } = await broadcast({ request: { id, signature } });

          if ('reason' in result) {
            write?.({ recklesslySetUnpreparedArgs: inputStruct });
          }
        } catch {}
      },
      onError
    }
  );

  const [createPostViaDispatcher, { loading: dispatcherLoading }] = useMutation(
    CreatePostViaDispatcherDocument,
    {
      onCompleted: (data) => {
        onCompleted();
        if (data.createPostViaDispatcher.__typename === 'RelayerResult') {
          setTxnQueue([generateOptimisticPost(data.createPostViaDispatcher.txHash), ...txnQueue]);
        }
      },
      onError
    }
  );

  const createPost = async () => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }
    if (publicationContent.length === 0 && attachments.length === 0) {
      return setPostContentError('Post should not be empty!');
    }

    setPostContentError('');
    setIsUploading(true);
    const id = await uploadToArweave({
      version: '2.0.0',
      metadata_id: uuid(),
      description: trimify(publicationContent),
      content: trimify(publicationContent),
      external_url: `https://lenster.xyz/u/${currentProfile?.handle}`,
      image: attachments.length > 0 ? attachments[0]?.item : null,
      imageMimeType: attachments.length > 0 ? attachments[0]?.type : null,
      name: `Post by @${currentProfile?.handle}`,
      tags: getTags(publicationContent),
      mainContentFocus:
        attachments.length > 0
          ? attachments[0]?.type === 'video/mp4'
            ? PublicationMainFocus.Video
            : PublicationMainFocus.Image
          : PublicationMainFocus.TextOnly,
      contentWarning: null, // TODO
      attributes: [
        {
          traitType: 'string',
          key: 'type',
          value: 'post'
        }
      ],
      media: attachments,
      locale: getUserLocale(),
      createdOn: new Date(),
      appId: APP_NAME
    }).finally(() => setIsUploading(false));

    const request = {
      profileId: currentProfile?.id,
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
      createPostViaDispatcher({
        variables: { request }
      });
    } else {
      createPostTypedData({
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
    <div className="py-3">
      {error && <ErrorMessage className="mb-3" title="Transaction failed!" error={error} />}
      {previewPublication ? (
        <div className="pb-3 mb-2 border-b linkify dark:border-b-gray-700/80 break-words">
          <Markup>{publicationContent}</Markup>
        </div>
      ) : (
        <MentionTextArea
          error={postContentError}
          setError={setPostContentError}
          placeholder="What's happening?"
          hideBorder
          autoFocus
        />
      )}
      <div className="block items-center sm:flex px-5">
        <div className="flex items-center space-x-4">
          <Attachment attachments={attachments} setAttachments={setAttachments} />
          <Giphy setGifAttachment={(gif: IGif) => setGifAttachment(gif)} />
          <CollectSettings />
          <ReferenceSettings />
          {publicationContent && <Preview />}
        </div>
        <div className="ml-auto pt-2 sm:pt-0">
          <Button
            disabled={isLoading}
            icon={isLoading ? <Spinner size="xs" /> : <PencilAltIcon className="w-4 h-4" />}
            onClick={createPost}
          >
            Post
          </Button>
        </div>
      </div>
      <div className="px-5">
        <Attachments attachments={attachments} setAttachments={setAttachments} isNew />
      </div>
    </div>
  );
};

export default NewUpdate;
