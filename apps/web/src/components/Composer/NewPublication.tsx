import type {
  MirrorablePublication,
  MomokaCommentRequest,
  MomokaPostRequest,
  MomokaQuoteRequest,
  OnchainCommentRequest,
  OnchainPostRequest,
  OnchainQuoteRequest,
  Quote
} from '@hey/lens';
import type { IGif } from '@hey/types/giphy';
import type { NewAttachment } from '@hey/types/misc';
import type { FC } from 'react';

import NewAttachments from '@components/Composer/NewAttachments';
import QuotedPublication from '@components/Publication/QuotedPublication';
import { AudioPublicationSchema } from '@components/Shared/Audio';
import Wrapper from '@components/Shared/Embed/Wrapper';
import errorToast from '@helpers/errorToast';
import { Leafwatch } from '@helpers/leafwatch';
import uploadToArweave from '@helpers/uploadToArweave';
import { KNOWN_ATTRIBUTES } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { PUBLICATION } from '@hey/data/tracking';
import checkDispatcherPermissions from '@hey/helpers/checkDispatcherPermissions';
import collectModuleParams from '@hey/helpers/collectModuleParams';
import getMentions from '@hey/helpers/getMentions';
import getProfile from '@hey/helpers/getProfile';
import removeQuoteOn from '@hey/helpers/removeQuoteOn';
import { ReferenceModuleType } from '@hey/lens';
import { Button, Card, ErrorMessage, Input, Switch } from '@hey/ui';
import cn from '@hey/ui/cn';
import { MetadataAttributeType } from '@lens-protocol/metadata';
import { useUnmountEffect } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useCreatePoll from 'src/hooks/useCreatePoll';
import useCreatePublication from 'src/hooks/useCreatePublication';
import usePublicationMetadata from 'src/hooks/usePublicationMetadata';
import { useCollectModuleStore } from 'src/store/non-persisted/publication/useCollectModuleStore';
import { usePublicationAttachmentStore } from 'src/store/non-persisted/publication/usePublicationAttachmentStore';
import { usePublicationAttributesStore } from 'src/store/non-persisted/publication/usePublicationAttributesStore';
import {
  DEFAULT_AUDIO_PUBLICATION,
  usePublicationAudioStore
} from 'src/store/non-persisted/publication/usePublicationAudioStore';
import { usePublicationLicenseStore } from 'src/store/non-persisted/publication/usePublicationLicenseStore';
import { usePublicationLiveStore } from 'src/store/non-persisted/publication/usePublicationLiveStore';
import { usePublicationPollStore } from 'src/store/non-persisted/publication/usePublicationPollStore';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';
import {
  DEFAULT_VIDEO_THUMBNAIL,
  usePublicationVideoStore
} from 'src/store/non-persisted/publication/usePublicationVideoStore';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useNonceStore } from 'src/store/non-persisted/useNonceStore';
import { useProfileStatus } from 'src/store/non-persisted/useProfileStatus';
import { useProStore } from 'src/store/non-persisted/useProStore';
import { useReferenceModuleStore } from 'src/store/non-persisted/useReferenceModuleStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { parseEther } from 'viem';
import { createOpenActionModuleInput } from 'pwyw-collect-module';
import { PWYWCollectModule } from '../PWYWCollectModule';

import LivestreamEditor from './Actions/LivestreamSettings/LivestreamEditor';
import PollEditor from './Actions/PollSettings/PollEditor';
import { Editor, useEditorContext, withEditorContext } from './Editor';
import LinkPreviews from './LinkPreviews';
import OpenActionsPreviews from './OpenActionsPreviews';
import Discard from './Post/Discard';

const Shimmer = <div className="shimmer mb-1 size-5 rounded-lg" />;

const Attachment = dynamic(
  () => import('@components/Composer/Actions/Attachment'),
  { loading: () => Shimmer }
);
const EmojiPicker = dynamic(() => import('@components/Shared/EmojiPicker'), {
  loading: () => Shimmer
});
const Gif = dynamic(() => import('@components/Composer/Actions/Gif'), {
  loading: () => Shimmer
});
const CollectSettings = dynamic(
  () => import('@components/Composer/Actions/CollectSettings'),
  { loading: () => Shimmer }
);
const ReferenceSettings = dynamic(
  () => import('@components/Composer/Actions/ReferenceSettings'),
  { loading: () => Shimmer }
);
const PollSettings = dynamic(
  () => import('@components/Composer/Actions/PollSettings'),
  { loading: () => Shimmer }
);
const LivestreamSettings = dynamic(
  () => import('@components/Composer/Actions/LivestreamSettings'),
  { loading: () => Shimmer }
);
const DraftSettings = dynamic(
  () => import('@components/Composer/Actions/DraftSettings'),
  { loading: () => Shimmer }
);

interface NewPublicationProps {
  publication?: MirrorablePublication;
}

const NewPublication: FC<NewPublicationProps> = ({ publication }) => {
  const { currentProfile } = useProfileStore();
  const { isSuspended } = useProfileStatus();
  const { isPro } = useProStore();

  // Global modal store
  const { setShowDiscardModal, setShowNewPostModal } =
    useGlobalModalStateStore();

  // Nonce store
  const { lensHubOnchainSigNonce } = useNonceStore();

  // Publication store
  const {
    publicationContent,
    quotedPublication,
    setPublicationContent,
    setQuotedPublication,
    setTags
  } = usePublicationStore();

  // Audio store
  const { audioPublication, setAudioPublication } = usePublicationAudioStore();

  // Video store
  const { setVideoThumbnail, videoThumbnail } = usePublicationVideoStore();

  // Live video store
  const { resetLiveVideoConfig, setShowLiveVideoEditor, showLiveVideoEditor } =
    usePublicationLiveStore();

  // Attachment store
  const { addAttachments, attachments, isUploading, setAttachments } =
    usePublicationAttachmentStore((state) => state);

  // Poll store
  const { pollConfig, resetPollConfig, setShowPollEditor, showPollEditor } =
    usePublicationPollStore();

  // License store
  const { setLicense } = usePublicationLicenseStore();

  // Collect module store
  const { collectModule, reset: resetCollectSettings } = useCollectModuleStore(
    (state) => state
  );

  // Reference module store
  const { degreesOfSeparation, onlyFollowers, selectedReferenceModule } =
    useReferenceModuleStore();

  // Attributes store
  const { reset: resetAttributes } = usePublicationAttributesStore();

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [publicationContentError, setPublicationContentError] = useState('');
  const [nftOpenActionEmbed, setNftOpenActionEmbed] = useState();
  const [exceededMentionsLimit, setExceededMentionsLimit] = useState(false);
  const [isPWYW, setIsPWYW] = useState(false);
  const [amountFloor, setAmountFloor] = useState('');
  const [collectLimit, setCollectLimit] = useState('');
  const [currency, setCurrency] = useState('');
  const [referralFee, setReferralFee] = useState('');
  const [followerOnly, setFollowerOnly] = useState(false);
  const [endTimestamp, setEndTimestamp] = useState('');

  const editor = useEditorContext();

  const createPoll = useCreatePoll();
  const getMetadata = usePublicationMetadata();

  const { canUseLensManager } = checkDispatcherPermissions(currentProfile);

  const isComment = Boolean(publication);
  const isQuote = Boolean(quotedPublication);
  const hasAudio = attachments[0]?.type === 'Audio';
  const hasVideo = attachments[0]?.type === 'Video';

  const noCollect = !collectModule.type;
  // Use Momoka if the profile the comment or quote has momoka proof and also check collect module has been disabled
  const useMomoka = isComment
    ? publication?.momoka?.proof
    : isQuote
      ? quotedPublication?.momoka?.proof
      : noCollect;

  const reset = () => {
    editor?.setMarkdown('');
    setPublicationContent('');
    setTags(null);
    setShowPollEditor(false);
    resetPollConfig();
    setShowLiveVideoEditor(false);
    resetLiveVideoConfig();
    setAttachments([]);
    setVideoThumbnail(DEFAULT_VIDEO_THUMBNAIL);
    setAudioPublication(DEFAULT_AUDIO_PUBLICATION);
    setLicense(null);
    resetAttributes();
    resetCollectSettings();
  };

  const onError = (error?: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const onCompleted = (
    __typename?:
      | 'CreateMomokaPublicationResult'
      | 'LensProfileManagerRelayError'
      | 'RelayError'
      | 'RelaySuccess'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return onError();
    }

    setIsLoading(false);
    setQuotedPublication(null);
    reset();

    if (!isComment) {
      setShowNewPostModal(false);
    }

    // Track in leafwatch
    const eventProperties = {
      comment_on: isComment ? publication?.id : null,
      publication_collect_module: collectModule.type,
      publication_has_attachments: attachments.length > 0,
      publication_has_poll: showPollEditor,
      publication_is_live: showLiveVideoEditor,
      publication_reference_module: selectedReferenceModule,
      publication_reference_module_degrees_of_separation:
        selectedReferenceModule ===
        ReferenceModuleType.DegreesOfSeparationReferenceModule
          ? degreesOfSeparation
          : null,
      quote_on: isQuote ? quotedPublication?.id : null
    };
    Leafwatch.track(
      isComment
        ? PUBLICATION.NEW_COMMENT
        : isQuote
          ? PUBLICATION.NEW_QUOTE
          : PUBLICATION.NEW_POST,
      eventProperties
    );
  };

  const {
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
  } = useCreatePublication({
    commentOn: publication,
    onCompleted,
    onError,
    quoteOn: quotedPublication as Quote
  });

  useEffect(() => {
    setPublicationContentError('');
  }, [audioPublication]);

  useEffect(() => {
    if (getMentions(publicationContent).length > 50) {
      setExceededMentionsLimit(true);
      setPublicationContentError('You can only mention 50 people at a time!');
    } else {
      setExceededMentionsLimit(false);
      setPublicationContentError('');
    }
  }, [publicationContent]);

  const getAnimationUrl = () => {
    const fallback =
      'ipfs://bafkreiaoua5s4iyg4gkfjzl6mzgenw4qw7mwgxj7zf7ev7gga72o5d3lf4';

    if (attachments.length > 0 || hasAudio || hasVideo) {
      return attachments[0]?.uri || fallback;
    }

    return fallback;
  };

  const getTitlePrefix = () => {
    if (hasVideo) {
      return 'Video';
    }

    return isComment ? 'Comment' : isQuote ? 'Quote' : 'Post';
  };

  // Extracted method to handle Momoka publication creation
  async function handleMomokaPublication(momokaRequest, publicationType) {
    if (publicationType === 'comment') {
      return await createMomokaCommentTypedData({
        variables: { request: momokaRequest }
      });
    } else if (publicationType === 'quote') {
      return await createMomokaQuoteTypedData({
        variables: { request: momokaRequest }
      });
    } else {
      return await createMomokaPostTypedData({
        variables: { request: momokaRequest }
      });
    }
  }

  // Extracted method to handle on-chain publication creation
  async function handleOnChainPublication(onChainRequest, publicationType) {
    if (publicationType === 'comment') {
      return await createOnchainCommentTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request: onChainRequest
        }
      });
    } else if (publicationType === 'quote') {
      return await createOnchainQuoteTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request: onChainRequest
        }
      });
    } else {
      return await createOnchainPostTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request: onChainRequest
        }
      });
    }
  }

  // Main method simplified
  async function createPublication() {
    try {
      setIsLoading(true);
      const publicationType = getPublicationType();
      const momokaRequest = prepareMomokaRequest();
      const onChainRequest = prepareOnChainRequest();

      if (useMomoka && !nftOpenActionEmbed) {
        if (canUseLensManager) {
          return await handleMomokaPublication(momokaRequest, publicationType);
        }
        return await handleMomokaPublication(momokaRequest, publicationType);
      }

      if (canUseLensManager) {
        return await handleOnChainPublication(onChainRequest, publicationType);
      }
      return await handleOnChainPublication(onChainRequest, publicationType);
    } catch (error) {
      onError(error);
    }
  }

  // Helper to determine the type of publication
  function getPublicationType() {
    if (isComment) {
      return 'comment';
    } else if (isQuote) {
      return 'quote';
    }
    return 'post';
  }

  // Prepare the Momoka request object
  function prepareMomokaRequest() {
    return {
      ...(isComment && { commentOn: publication?.id }),
      ...(isQuote && { quoteOn: quotedPublication?.id }),
      contentURI: `ar://${arweaveId}`
    };
  }

  // Prepare the on-chain request object
  function prepareOnChainRequest() {
    const openActionModules = [];

    if (isPWYW) {
      const collectInitData = createOpenActionModuleInput({
        amountFloor: amountFloor ? parseEther(amountFloor).toString() : '0',
        collectLimit: collectLimit || '0',
        currency: currency || ZERO_ADDRESS,
        referralFee: referralFee || '0',
        followerOnly: followerOnly || false,
        endTimestamp: endTimestamp ? new Date(endTimestamp).getTime() / 1000 : '0',
        recipients: [
          { recipient: currentProfile?.ownedBy.address, split: 10000 }
        ]
      });

      openActionModules.push({
        unknownOpenAction: {
          address: COLLECT_PUBLICATION_ACTION_ADDRESS,
          data: collectInitData
        }
      });
    }

    return {
      contentURI: `ar://${arweaveId}`,
      ...(isComment && { commentOn: publication?.id }),
      ...(isQuote && { quoteOn: quotedPublication?.id }),
      openActionModules,
      ...(onlyFollowers && {
        referenceModule: selectedReferenceModule === ReferenceModuleType.FollowerOnlyReferenceModule
          ? { followerOnlyReferenceModule: true }
          : {
              degreesOfSeparationReferenceModule: {
                commentsRestricted: true,
                degreesOfSeparation,
                mirrorsRestricted: true,
                quotesRestricted: true
              }
            }
      })
    };
  }

  const setGifAttachment = (gif: IGif) => {
    const attachment: NewAttachment = {
      mimeType: 'image/gif',
      previewUri: gif.images.original.url,
      type: 'Image',
      uri: gif.images.original.url
    };
    addAttachments([attachment]);
  };

  const isSubmitDisabledByPoll = showPollEditor
    ? !pollConfig.options.length ||
      pollConfig.options.some((option) => !option.length)
    : false;

  const onDiscardClick = () => {
    setQuotedPublication(null);
    setShowNewPostModal(false);
    setShowDiscardModal(false);
    reset();
  };

  useUnmountEffect(() => reset());

  return (
    <Card
      className={cn({
        '!rounded-b-xl !rounded-t-none border-none': !isComment
      })}
      onClick={() => setShowEmojiPicker(false)}
    >
      {error ? (
        <ErrorMessage
          className="!rounded-none"
          error={error}
          title="Transaction failed!"
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
      <OpenActionsPreviews setNftOpenActionEmbed={setNftOpenActionEmbed} />
      {!nftOpenActionEmbed ? <LinkPreviews /> : null}
      <NewAttachments attachments={attachments} />
      {quotedPublication ? (
        <Wrapper className="m-5" zeroPadding>
          <QuotedPublication
            isNew
            publication={removeQuoteOn(quotedPublication as Quote)}
          />
        </Wrapper>
      ) : null}
      <div className="divider mx-5" />
      <div className="block items-center px-5 py-3 sm:flex">
        <div className="flex items-center space-x-4">
          <Attachment />
          <EmojiPicker
            setEmoji={(emoji: string) => {
              setShowEmojiPicker(false);
              editor?.insertText(emoji);
            }}
            setShowEmojiPicker={setShowEmojiPicker}
            showEmojiPicker={showEmojiPicker}
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
          {isPro && <DraftSettings />}
        </div>
        <div className="ml-auto mt-2 sm:mt-0">
          <Button
            disabled={
              isLoading ||
              isUploading ||
              isSubmitDisabledByPoll ||
              videoThumbnail.uploading ||
              exceededMentionsLimit
            }
            onClick={createPublication}
          >
            {isComment ? 'Comment' : 'Post'}
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <Switch
          checked={isPWYW}
          label="Enable Pay What You Want"
          onChange={setIsPWYW}
        />
        {isPWYW && (
          <>
            <Input
              label="Amount Floor"
              onChange={(e) => setAmountFloor(e.target.value)}
              placeholder="Minimum amount (optional)"
              type="number"
              value={amountFloor}
            />
            <Input
              label="Collect Limit"
              onChange={(e) => setCollectLimit(e.target.value)}
              placeholder="Maximum number of collects (optional)"
              type="number"
              value={collectLimit}
            />
            <Input
              label="Currency"
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="Currency address (optional)"
              value={currency}
            />
            <Input
              label="Referral Fee"
              onChange={(e) => setReferralFee(e.target.value)}
              placeholder="Referral fee percentage (optional)"
              type="number"
              value={referralFee}
            />
            <Switch
              checked={followerOnly}
              label="Followers Only"
              onChange={setFollowerOnly}
            />
            <Input
              label="End Timestamp"
              onChange={(e) => setEndTimestamp(e.target.value)}
              type="datetime-local"
              value={endTimestamp}
            />
          </>
        )}
      </div>
      <Discard onDiscard={onDiscardClick} />
    </Card>
  );
};

export default withEditorContext(NewPublication);
