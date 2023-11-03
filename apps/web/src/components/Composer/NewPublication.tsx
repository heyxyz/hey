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
import { Errors } from '@hey/data/errors';
import { PUBLICATION } from '@hey/data/tracking';
import type {
  AnyPublication,
  MomokaCommentRequest,
  MomokaPostRequest,
  MomokaQuoteRequest,
  OnchainCommentRequest,
  OnchainPostRequest,
  OnchainQuoteRequest,
  Quote
} from '@hey/lens';
import { ReferenceModuleType } from '@hey/lens';
import checkDispatcherPermissions from '@hey/lib/checkDispatcherPermissions';
import collectModuleParams from '@hey/lib/collectModuleParams';
import getProfile from '@hey/lib/getProfile';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import removeQuoteOn from '@hey/lib/removeQuoteOn';
import type { IGif } from '@hey/types/giphy';
import type { NewAttachment } from '@hey/types/misc';
import { Button, Card, ErrorMessage, Spinner } from '@hey/ui';
import cn from '@hey/ui/cn';
import { $convertFromMarkdownString } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import errorToast from '@lib/errorToast';
import getTextNftUrl from '@lib/getTextNftUrl';
import { Leafwatch } from '@lib/leafwatch';
import uploadToArweave from '@lib/uploadToArweave';
import { useUnmountEffect } from 'framer-motion';
import { $getRoot } from 'lexical';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useCreatePoll from 'src/hooks/useCreatePoll';
import useCreatePublication from 'src/hooks/useCreatePublication';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import usePublicationMetadata from 'src/hooks/usePublicationMetadata';
import { useAppStore } from 'src/store/useAppStore';
import { useCollectModuleStore } from 'src/store/useCollectModuleStore';
import { useGlobalModalStateStore } from 'src/store/useGlobalModalStateStore';
import { useNonceStore } from 'src/store/useNonceStore';
import { usePublicationStore } from 'src/store/usePublicationStore';
import { useReferenceModuleStore } from 'src/store/useReferenceModuleStore';
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts';

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
  const { lensHubOnchainSigNonce } = useNonceStore();

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

  // Collect module store
  const { collectModule, reset: resetCollectSettings } =
    useCollectModuleStore();

  // Reference module store
  const { selectedReferenceModule, onlyFollowers, degreesOfSeparation } =
    useReferenceModuleStore();

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [publicationContentError, setPublicationContentError] = useState('');

  const [editor] = useLexicalComposerContext();
  const createPoll = useCreatePoll();
  const getMetadata = usePublicationMetadata();
  const handleWrongNetwork = useHandleWrongNetwork();

  const { isSponsored, canUseLensManager } =
    checkDispatcherPermissions(currentProfile);

  const isComment = Boolean(publication);
  const isQuote = Boolean(quotedPublication);
  const hasAudio = attachments[0]?.type === 'Audio';
  const hasVideo = attachments[0]?.type === 'Video';

  const noCollect = !collectModule.type;
  // Use Momoka if the profile the comment or quote has momoka proof and also check collect module has been disabled
  const useMomoka = isComment
    ? publication.momoka?.proof
    : isQuote
    ? quotedPublication?.momoka?.proof
    : noCollect;

  const onError = (error?: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const onCompleted = (
    __typename?:
      | 'RelayError'
      | 'RelaySuccess'
      | 'CreateMomokaPublicationResult'
      | 'LensProfileManagerRelayError'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return onError();
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
      // TODO: add encrypted type in future
      publication_type: 'public',
      publication_collect_module: collectModule.type,
      publication_reference_module: selectedReferenceModule,
      publication_reference_module_degrees_of_separation:
        selectedReferenceModule ===
        ReferenceModuleType.DegreesOfSeparationReferenceModule
          ? degreesOfSeparation
          : null,
      publication_has_attachments: attachments.length > 0,
      publication_has_poll: showPollEditor,
      publication_is_live: showLiveVideoEditor,
      comment_on: isComment ? targetPublication.id : null,
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
    createCommentOnMomka,
    createQuoteOnMomka,
    createPostOnMomka,
    createCommentOnChain,
    createQuoteOnChain,
    createPostOnChain,
    createMomokaCommentTypedData,
    createMomokaQuoteTypedData,
    createMomokaPostTypedData,
    createOnchainCommentTypedData,
    createOnchainQuoteTypedData,
    createOnchainPostTypedData,
    error
  } = useCreatePublication({
    onCompleted,
    onError,
    commentOn: publication,
    isComment,
    isQuote
  });

  useUpdateEffect(() => {
    setPublicationContentError('');
  }, [audioPublication]);

  useEffectOnce(() => {
    editor.update(() => {
      $convertFromMarkdownString(publicationContent);
    });
  });

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
      let textNftImageUrl;
      if (!attachments.length && !useMomoka) {
        textNftImageUrl = await getTextNftUrl(
          publicationContent,
          getProfile(currentProfile).slug,
          new Date().toLocaleString()
        );
      }

      let processedPublicationContent =
        publicationContent.length > 0 ? publicationContent : undefined;

      if (showPollEditor) {
        processedPublicationContent = await createPoll();
      }
      const title = hasAudio
        ? audioPublication.title
        : `${getTitlePrefix()} by ${getProfile(currentProfile).slugWithPrefix}`;

      const baseMetadata = {
        title,
        content: processedPublicationContent,
        marketplace: {
          name: title,
          description: processedPublicationContent,
          animation_url: getAnimationUrl() || textNftImageUrl,
          external_url: `https://hey.xyz${getProfile(currentProfile).link}`
        }
      };

      const metadata = getMetadata({ baseMetadata });

      const arweaveId = await uploadToArweave(metadata);

      // Payload for the open action module
      let openActionModules = [];
      if (collectModule.type) {
        openActionModules.push({
          collectOpenAction: collectModuleParams(collectModule, currentProfile)
        });
      }

      // Payload for the Momoka post/comment/quote
      const momokaRequest:
        | MomokaPostRequest
        | MomokaCommentRequest
        | MomokaQuoteRequest = {
        ...(isComment && { commentOn: targetPublication.id }),
        ...(isQuote && { quoteOn: quotedPublication?.id }),
        contentURI: `ar://${arweaveId}`
      };

      if (useMomoka) {
        if (canUseLensManager) {
          if (isComment) {
            return await createCommentOnMomka(
              momokaRequest as MomokaCommentRequest
            );
          }

          if (isQuote) {
            return await createQuoteOnMomka(
              momokaRequest as MomokaQuoteRequest
            );
          }

          return await createPostOnMomka(momokaRequest);
        }

        if (isComment) {
          return await createMomokaCommentTypedData({
            variables: { request: momokaRequest as MomokaCommentRequest }
          });
        }

        if (isQuote) {
          return await createMomokaQuoteTypedData({
            variables: { request: momokaRequest as MomokaQuoteRequest }
          });
        }

        return await createMomokaPostTypedData({
          variables: { request: momokaRequest }
        });
      }

      // Payload for the post/comment/quote
      const onChainRequest:
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

      if (canUseLensManager) {
        if (isComment) {
          return await createCommentOnChain(
            onChainRequest as OnchainCommentRequest
          );
        }

        if (isQuote) {
          return await createQuoteOnChain(
            onChainRequest as OnchainQuoteRequest
          );
        }

        return await createPostOnChain(onChainRequest);
      }

      if (isComment) {
        return await createOnchainCommentTypedData({
          variables: {
            options: { overrideSigNonce: lensHubOnchainSigNonce },
            request: onChainRequest as OnchainCommentRequest
          }
        });
      }

      if (isQuote) {
        return await createOnchainQuoteTypedData({
          variables: {
            options: { overrideSigNonce: lensHubOnchainSigNonce },
            request: onChainRequest as OnchainQuoteRequest
          }
        });
      }

      return await createOnchainPostTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request: onChainRequest
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  const setGifAttachment = (gif: IGif) => {
    const attachment: NewAttachment = {
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
          title="Transaction failed!"
          error={error}
          className="!rounded-none"
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
          <QuotedPublication
            publication={removeQuoteOn(quotedPublication as Quote)}
            isNew
          />
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
