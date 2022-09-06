import { LensHubProxy } from '@abis/LensHubProxy';
import { useMutation } from '@apollo/client';
import Attachments from '@components/Shared/Attachments';
import Markup from '@components/Shared/Markup';
import PubIndexStatus from '@components/Shared/PubIndexStatus';
import { Button } from '@components/UI/Button';
import { Card } from '@components/UI/Card';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { MentionTextArea } from '@components/UI/MentionTextArea';
import { Spinner } from '@components/UI/Spinner';
import useBroadcast from '@components/utils/hooks/useBroadcast';
import { LensterAttachment } from '@generated/lenstertypes';
import { CreatePostBroadcastItemResult, Mutation, PublicationMainFocus } from '@generated/types';
import { IGif } from '@giphy/js-types';
import {
  CREATE_POST_TYPED_DATA_MUTATION,
  CREATE_POST_VIA_DISPATHCER_MUTATION
} from '@gql/TypedAndDispatcherData/CreatePost';
import { PencilAltIcon } from '@heroicons/react/outline';
import { defaultFeeData, defaultModuleData, getModule } from '@lib/getModule';
import getSignature from '@lib/getSignature';
import getTags from '@lib/getTags';
import { Mixpanel } from '@lib/mixpanel';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import trimify from '@lib/trimify';
import uploadToArweave from '@lib/uploadToArweave';
import dynamic from 'next/dynamic';
import { Dispatch, FC, useState } from 'react';
import toast from 'react-hot-toast';
import { APP_NAME, LENSHUB_PROXY, RELAY_ON, SIGN_WALLET } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { useCollectModuleStore } from 'src/store/collectmodule';
import { usePublicationStore } from 'src/store/publication';
import { POST } from 'src/tracking';
import { v4 as uuid } from 'uuid';
import { useContractWrite, useSignTypedData } from 'wagmi';

const Attachment = dynamic(() => import('../../Shared/Attachment'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});
const Giphy = dynamic(() => import('../../Shared/Giphy'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});
const SelectCollectModule = dynamic(() => import('../../Shared/SelectCollectModule'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});
const SelectReferenceModule = dynamic(() => import('../../Shared/SelectReferenceModule'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});
const Preview = dynamic(() => import('../../Shared/Preview'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});

interface Props {
  setShowModal?: Dispatch<boolean>;
  hideCard?: boolean;
}

const NewPost: FC<Props> = ({ setShowModal, hideCard = false }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const publicationContent = usePublicationStore((state) => state.publicationContent);
  const setPublicationContent = usePublicationStore((state) => state.setPublicationContent);
  const previewPublication = usePublicationStore((state) => state.previewPublication);
  const setPreviewPublication = usePublicationStore((state) => state.setPreviewPublication);
  const selectedModule = useCollectModuleStore((state) => state.selectedModule);
  const setSelectedModule = useCollectModuleStore((state) => state.setSelectedModule);
  const feeData = useCollectModuleStore((state) => state.feeData);
  const setFeeData = useCollectModuleStore((state) => state.setFeeData);
  const [postContentError, setPostContentError] = useState('');
  const [onlyFollowers, setOnlyFollowers] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState<LensterAttachment[]>([]);
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const onCompleted = () => {
    setPreviewPublication(false);
    setPublicationContent('');
    setAttachments([]);
    setSelectedModule(defaultModuleData);
    setFeeData(defaultFeeData);
    Mixpanel.track(POST.NEW);
  };

  const {
    data,
    error,
    isLoading: writeLoading,
    write
  } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'postWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  const { broadcast, data: broadcastData, loading: broadcastLoading } = useBroadcast({ onCompleted });
  const [createPostTypedData, { loading: typedDataLoading }] = useMutation<Mutation>(
    CREATE_POST_TYPED_DATA_MUTATION,
    {
      onCompleted: async ({
        createPostTypedData
      }: {
        createPostTypedData: CreatePostBroadcastItemResult;
      }) => {
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
          } = typedData?.value;
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
          if (RELAY_ON) {
            const {
              data: { broadcast: result }
            } = await broadcast({ request: { id, signature } });

            if ('reason' in result) {
              write?.({ recklesslySetUnpreparedArgs: inputStruct });
            }
          } else {
            write?.({ recklesslySetUnpreparedArgs: inputStruct });
          }
        } catch {}
      },
      onError
    }
  );

  const [createPostViaDispatcher, { data: dispatcherData, loading: dispatcherLoading }] = useMutation(
    CREATE_POST_VIA_DISPATHCER_MUTATION,
    { onCompleted, onError }
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
    // TODO: Add animated_url support
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
      locale: 'en',
      createdOn: new Date(),
      appId: APP_NAME
    }).finally(() => setIsUploading(false));

    const request = {
      profileId: currentProfile?.id,
      contentURI: `https://arweave.net/${id}`,
      collectModule: feeData.recipient
        ? {
            [getModule(selectedModule.moduleName).config]: feeData
          }
        : getModule(selectedModule.moduleName).config,
      referenceModule: {
        followerOnlyReferenceModule: onlyFollowers ? true : false
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
      altTag: ''
    };
    setAttachments([...attachments, attachment]);
  };

  const isLoading =
    isUploading || typedDataLoading || dispatcherLoading || signLoading || writeLoading || broadcastLoading;

  return (
    <Card className={hideCard ? 'border-0 !shadow-none !bg-transparent' : ''}>
      <div className="px-5 pt-5 pb-3">
        <div className="space-y-1">
          {error && <ErrorMessage className="mb-3" title="Transaction failed!" error={error} />}
          {previewPublication ? (
            <div className="pb-3 mb-2 border-b linkify dark:border-b-gray-700/80">
              <Markup>{publicationContent}</Markup>
            </div>
          ) : (
            <MentionTextArea
              error={postContentError}
              setError={setPostContentError}
              placeholder="What's happening?"
            />
          )}
          <div className="block items-center sm:flex">
            <div className="flex items-center space-x-4">
              <Attachment attachments={attachments} setAttachments={setAttachments} />
              <Giphy setGifAttachment={(gif: IGif) => setGifAttachment(gif)} />
              <SelectCollectModule />
              <SelectReferenceModule onlyFollowers={onlyFollowers} setOnlyFollowers={setOnlyFollowers} />
              {publicationContent && <Preview />}
            </div>
            <div className="flex items-center pt-2 ml-auto space-x-2 sm:pt-0">
              {data?.hash ??
              broadcastData?.broadcast?.txHash ??
              dispatcherData?.createPostViaDispatcher?.txHash ? (
                <PubIndexStatus
                  type="Post"
                  txHash={
                    data?.hash ??
                    broadcastData?.broadcast?.txHash ??
                    dispatcherData?.createPostViaDispatcher?.txHash
                  }
                />
              ) : null}
              <Button
                className="ml-auto"
                disabled={isLoading}
                icon={isLoading ? <Spinner size="xs" /> : <PencilAltIcon className="w-4 h-4" />}
                onClick={createPost}
              >
                {isUploading
                  ? 'Uploading to Arweave'
                  : typedDataLoading
                  ? 'Generating Post'
                  : signLoading
                  ? 'Sign'
                  : writeLoading || broadcastLoading
                  ? 'Send'
                  : 'Post'}
              </Button>
            </div>
          </div>
          <Attachments attachments={attachments} setAttachments={setAttachments} isNew />
        </div>
      </div>
    </Card>
  );
};

export default NewPost;
