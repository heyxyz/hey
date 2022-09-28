import { LensHubProxy } from '@abis/LensHubProxy';
import { useMutation } from '@apollo/client';
import Attachments from '@components/Shared/Attachments';
import Markup from '@components/Shared/Markup';
import Preview from '@components/Shared/Preview';
import { Button } from '@components/UI/Button';
import { Card } from '@components/UI/Card';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { MentionTextArea } from '@components/UI/MentionTextArea';
import { Spinner } from '@components/UI/Spinner';
import useBroadcast from '@components/utils/hooks/useBroadcast';
import { LensterAttachment, LensterPublication } from '@generated/lenstertypes';
import {
  CreateCommentBroadcastItemResult,
  Mutation,
  PublicationMainFocus,
  ReferenceModules
} from '@generated/types';
import { IGif } from '@giphy/js-types';
import {
  CREATE_COMMENT_TYPED_DATA_MUTATION,
  CREATE_COMMENT_VIA_DISPATHCER_MUTATION
} from '@gql/TypedAndDispatcherData/CreateComment';
import { ChatAlt2Icon } from '@heroicons/react/outline';
import { defaultFeeData, defaultModuleData, getModule } from '@lib/getModule';
import getSignature from '@lib/getSignature';
import getTags from '@lib/getTags';
import { Mixpanel } from '@lib/mixpanel';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import trimify from '@lib/trimify';
import uploadToArweave from '@lib/uploadToArweave';
import dynamic from 'next/dynamic';
import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { APP_NAME, LENSHUB_PROXY, RELAY_ON, SIGN_WALLET } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { useCollectModuleStore } from 'src/store/collectmodule';
import { usePublicationPersistStore, usePublicationStore } from 'src/store/publication';
import { useReferenceModuleStore } from 'src/store/referencemodule';
import { COMMENT } from 'src/tracking';
import { v4 as uuid } from 'uuid';
import { useContractWrite, useSignTypedData } from 'wagmi';

const Attachment = dynamic(() => import('../Shared/Attachment'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});
const Giphy = dynamic(() => import('../Shared/Giphy'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});
const SelectCollectModule = dynamic(() => import('../Shared/SelectCollectModule'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});
const SelectReferenceModule = dynamic(() => import('../Shared/SelectReferenceModule'), {
  loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />
});

interface Props {
  hideCard?: boolean;
  publication: LensterPublication;
}

const NewComment: FC<Props> = ({ hideCard = false, publication }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const publicationContent = usePublicationStore((state) => state.publicationContent);
  const setPublicationContent = usePublicationStore((state) => state.setPublicationContent);
  const previewPublication = usePublicationStore((state) => state.previewPublication);
  const setPreviewPublication = usePublicationStore((state) => state.setPreviewPublication);
  const txnQueue = usePublicationPersistStore((state) => state.txnQueue);
  const setTxnQueue = usePublicationPersistStore((state) => state.setTxnQueue);
  const selectedModule = useCollectModuleStore((state) => state.selectedModule);
  const setSelectedModule = useCollectModuleStore((state) => state.setSelectedModule);
  const feeData = useCollectModuleStore((state) => state.feeData);
  const setFeeData = useCollectModuleStore((state) => state.setFeeData);
  const selectedReferenceModule = useReferenceModuleStore((state) => state.selectedModule);
  const onlyFollowers = useReferenceModuleStore((state) => state.onlyFollowers);
  const { commentsRestricted, mirrorsRestricted, degreesOfSeparation } = useReferenceModuleStore();
  const [commentContentError, setCommentContentError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState<LensterAttachment[]>([]);

  const onCompleted = () => {
    setPreviewPublication(false);
    setPublicationContent('');
    setAttachments([]);
    setSelectedModule(defaultModuleData);
    setFeeData(defaultFeeData);
    Mixpanel.track(COMMENT.NEW);
  };

  const generateOptimisticComment = (txHash: string) => {
    console.log(txHash);
    return {
      id: uuid(),
      parent: publication.id,
      type: 'NEW_COMMENT',
      txHash,
      content: publicationContent,
      attachments
    };
  };

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const {
    error,
    isLoading: writeLoading,
    write
  } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'commentWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: ({ hash }) => {
      onCompleted();
      setTxnQueue([generateOptimisticComment(hash), ...txnQueue]);
    },
    onError
  });

  const { broadcast, loading: broadcastLoading } = useBroadcast({
    onCompleted: (data) => {
      onCompleted();
      setTxnQueue([generateOptimisticComment(data?.broadcast?.txHash), ...txnQueue]);
    }
  });
  const [createCommentTypedData, { loading: typedDataLoading }] = useMutation<Mutation>(
    CREATE_COMMENT_TYPED_DATA_MUTATION,
    {
      onCompleted: async ({
        createCommentTypedData
      }: {
        createCommentTypedData: CreateCommentBroadcastItemResult;
      }) => {
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
          } = typedData?.value;
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

  const [createCommentViaDispatcher, { loading: dispatcherLoading }] = useMutation(
    CREATE_COMMENT_VIA_DISPATHCER_MUTATION,
    {
      onCompleted: (data) => {
        onCompleted();
        setTxnQueue([generateOptimisticComment(data?.createCommentViaDispatcher?.txHash), ...txnQueue]);
      },
      onError
    }
  );

  const createComment = async () => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }
    if (publicationContent.length === 0 && attachments.length === 0) {
      return setCommentContentError('Comment should not be empty!');
    }

    setCommentContentError('');
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
      name: `Comment by @${currentProfile?.handle}`,
      tags: getTags(publicationContent),
      mainContentFocus:
        attachments.length > 0
          ? attachments[0]?.type === 'video/mp4'
            ? PublicationMainFocus.Video
            : PublicationMainFocus.Image
          : PublicationMainFocus.TextOnly,
      contentWarning: null,
      media: attachments,
      locale: 'en',
      createdOn: new Date(),
      appId: APP_NAME
    }).finally(() => setIsUploading(false));

    const request = {
      profileId: currentProfile?.id,
      publicationId: publication?.__typename === 'Mirror' ? publication?.mirrorOf?.id : publication?.id,
      contentURI: `https://arweave.net/${id}`,
      collectModule: feeData.recipient
        ? {
            [getModule(selectedModule.moduleName).config]: feeData
          }
        : getModule(selectedModule.moduleName).config,
      referenceModule:
        selectedReferenceModule === ReferenceModules.FollowerOnlyReferenceModule
          ? { followerOnlyReferenceModule: onlyFollowers ? true : false }
          : {
              degreesOfSeparationReferenceModule: {
                commentsRestricted,
                mirrorsRestricted,
                degreesOfSeparation
              }
            }
    };

    if (currentProfile?.dispatcher?.canUseRelay) {
      createCommentViaDispatcher({ variables: { request } });
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
              error={commentContentError}
              setError={setCommentContentError}
              placeholder="Tell something cool!"
            />
          )}
          <div className="block items-center sm:flex">
            <div className="flex items-center space-x-4">
              <Attachment attachments={attachments} setAttachments={setAttachments} />
              <Giphy setGifAttachment={(gif: IGif) => setGifAttachment(gif)} />
              <SelectCollectModule />
              <SelectReferenceModule />
              {publicationContent && <Preview />}
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
          <Attachments attachments={attachments} setAttachments={setAttachments} isNew />
        </div>
      </div>
    </Card>
  );
};

export default NewComment;
