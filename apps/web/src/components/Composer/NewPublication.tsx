import NewAttachments from "@components/Composer/NewAttachments";
import QuotedPost from "@components/Post/QuotedPost";
import { AudioPostSchema } from "@components/Shared/Audio";
import Wrapper from "@components/Shared/Embed/Wrapper";
import EmojiPicker from "@components/Shared/EmojiPicker";
import errorToast from "@helpers/errorToast";
import uploadMetadata from "@helpers/uploadMetadata";
import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import collectActionParams from "@hey/helpers/collectActionParams";
import getAccount from "@hey/helpers/getAccount";
import getMentions from "@hey/helpers/getMentions";
import type { Post } from "@hey/indexer";
import type { IGif } from "@hey/types/giphy";
import type { NewAttachment } from "@hey/types/misc";
import { Button, Card, H6 } from "@hey/ui";
import type { FC } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useCreatePost from "src/hooks/useCreatePost";
import usePostMetadata from "src/hooks/usePostMetadata";
import { useCollectActionStore } from "src/store/non-persisted/post/useCollectActionStore";
import { usePostAttachmentStore } from "src/store/non-persisted/post/usePostAttachmentStore";
import { usePostAttributesStore } from "src/store/non-persisted/post/usePostAttributesStore";
import {
  DEFAULT_AUDIO_POST,
  usePostAudioStore
} from "src/store/non-persisted/post/usePostAudioStore";
import { usePostLicenseStore } from "src/store/non-persisted/post/usePostLicenseStore";
import { usePostLiveStore } from "src/store/non-persisted/post/usePostLiveStore";
import { usePostStore } from "src/store/non-persisted/post/usePostStore";
import {
  DEFAULT_VIDEO_THUMBNAIL,
  usePostVideoStore
} from "src/store/non-persisted/post/usePostVideoStore";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useGlobalModalStore } from "src/store/non-persisted/useGlobalModalStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import Attachment from "./Actions/Attachment";
import CollectSettings from "./Actions/CollectSettings";
import Gif from "./Actions/Gif";
import LivestreamSettings from "./Actions/LivestreamSettings";
import LivestreamEditor from "./Actions/LivestreamSettings/LivestreamEditor";
import { Editor, useEditorContext, withEditorContext } from "./Editor";
import LinkPreviews from "./LinkPreviews";

interface NewPublicationProps {
  className?: string;
  post?: Post;
  feed?: string;
}

const NewPublication: FC<NewPublicationProps> = ({ className, post, feed }) => {
  const { currentAccount } = useAccountStore();
  const { isSuspended } = useAccountStatus();

  // Global modal store
  const { setShowNewPostModal } = useGlobalModalStore();

  // Post store
  const { postContent, quotedPost, setPostContent, setQuotedPost } =
    usePostStore();

  // Audio store
  const { audioPost, setAudioPost } = usePostAudioStore();

  // Video store
  const { setVideoThumbnail, videoThumbnail } = usePostVideoStore();

  // Live video store
  const { resetLiveVideoConfig, setShowLiveVideoEditor, showLiveVideoEditor } =
    usePostLiveStore();

  // Attachment store
  const { addAttachments, attachments, isUploading, setAttachments } =
    usePostAttachmentStore((state) => state);

  // License store
  const { setLicense } = usePostLicenseStore();

  // Collect module store
  const { collectAction, reset: resetCollectSettings } = useCollectActionStore(
    (state) => state
  );

  // Attributes store
  const { reset: resetAttributes } = usePostAttributesStore();

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [postContentError, setPostContentError] = useState("");
  const [exceededMentionsLimit, setExceededMentionsLimit] = useState(false);

  const editor = useEditorContext();
  const getMetadata = usePostMetadata();

  const isComment = Boolean(post);
  const isQuote = Boolean(quotedPost);
  const hasAudio = attachments[0]?.type === "Audio";
  const hasVideo = attachments[0]?.type === "Video";

  const reset = () => {
    editor?.setMarkdown("");
    setIsLoading(false);
    setPostContent("");
    setShowLiveVideoEditor(false);
    resetLiveVideoConfig();
    setAttachments([]);
    setQuotedPost(null);
    setVideoThumbnail(DEFAULT_VIDEO_THUMBNAIL);
    setAudioPost(DEFAULT_AUDIO_POST);
    setLicense(null);
    resetAttributes();
    resetCollectSettings();
    setShowNewPostModal(false);
  };

  const onError = (error?: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { createPost } = useCreatePost({
    commentOn: post,
    onCompleted: () => reset(),
    onError,
    quoteOf: quotedPost as Post
  });

  useEffect(() => {
    setPostContentError("");
  }, [audioPost]);

  useEffect(() => {
    if (getMentions(postContent).length > 50) {
      setExceededMentionsLimit(true);
      setPostContentError("You can only mention 50 people at a time!");
    } else {
      setExceededMentionsLimit(false);
      setPostContentError("");
    }
  }, [postContent]);

  const getAnimationUrl = () => {
    const fallback = `${STATIC_IMAGES_URL}/thumbnail.png`;

    if (attachments.length > 0 || hasAudio || hasVideo) {
      return attachments[0]?.uri || fallback;
    }

    return fallback;
  };

  const getTitlePrefix = () => {
    if (hasVideo) {
      return "Video";
    }

    return isComment ? "Comment" : isQuote ? "Quote" : "Post";
  };

  const handleCreatePost = async () => {
    if (!currentAccount) {
      return toast.error(Errors.SignWallet);
    }

    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      if (hasAudio) {
        setPostContentError("");
        const parsedData = AudioPostSchema.safeParse(audioPost);
        if (!parsedData.success) {
          const issue = parsedData.error.issues[0];
          setIsLoading(false);
          return setPostContentError(issue.message);
        }
      }

      if (postContent.length === 0 && attachments.length === 0) {
        setIsLoading(false);
        return setPostContentError(
          `${
            isComment ? "Comment" : isQuote ? "Quote" : "Post"
          } should not be empty!`
        );
      }

      setPostContentError("");

      const processedPostContent =
        postContent.length > 0 ? postContent : undefined;
      const title = hasAudio
        ? audioPost.title
        : `${getTitlePrefix()} by ${getAccount(currentAccount).usernameWithPrefix}`;

      const baseMetadata = {
        content: processedPostContent,
        title,
        marketplace: {
          animation_url: getAnimationUrl(),
          description: processedPostContent,
          external_url: `https://hey.xyz${getAccount(currentAccount).link}`,
          name: title
        }
      };

      const metadata = getMetadata({ baseMetadata });
      const contentUri = await uploadMetadata(metadata);

      return await createPost({
        variables: {
          request: {
            contentUri,
            ...(feed && { feed }),
            ...(isComment && { commentOn: { post: post?.id } }),
            ...(isQuote && { quoteOf: { post: quotedPost?.id } }),
            ...(collectAction.enabled && {
              actions: [{ ...collectActionParams(collectAction) }]
            })
          }
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  const setGifAttachment = (gif: IGif) => {
    const attachment: NewAttachment = {
      mimeType: "image/gif",
      previewUri: gif.images.original.url,
      type: "Image",
      uri: gif.images.original.url
    };
    addAttachments([attachment]);
  };

  return (
    <Card className={className} onClick={() => setShowEmojiPicker(false)}>
      <Editor />
      {postContentError ? (
        <H6 className="mt-1 px-5 pb-3 text-red-500">{postContentError}</H6>
      ) : null}
      {showLiveVideoEditor ? <LivestreamEditor /> : null}
      <LinkPreviews />
      <NewAttachments attachments={attachments} />
      {quotedPost ? (
        <Wrapper className="m-5" zeroPadding>
          <QuotedPost isNew post={quotedPost as Post} />
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
          <CollectSettings />
          {!isComment && <LivestreamSettings />}
        </div>
        <div className="mt-2 ml-auto sm:mt-0">
          <Button
            disabled={
              isLoading ||
              isUploading ||
              videoThumbnail.uploading ||
              exceededMentionsLimit
            }
            onClick={handleCreatePost}
          >
            {isComment ? "Comment" : "Post"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default withEditorContext(NewPublication);
