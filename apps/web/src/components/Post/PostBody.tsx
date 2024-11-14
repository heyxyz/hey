import Attachments from "@components/Shared/Attachments";
import Quote from "@components/Shared/Embed/Quote";
import Markup from "@components/Shared/Markup";
import Oembed from "@components/Shared/Oembed";
import Video from "@components/Shared/Video";
import { EyeIcon } from "@heroicons/react/24/outline";
import { KNOWN_ATTRIBUTES } from "@hey/data/constants";
import getPostAttribute from "@hey/helpers/getPostAttribute";
import getPostData from "@hey/helpers/getPostData";
import getURLs from "@hey/helpers/getURLs";
import isPostMetadataTypeAllowed from "@hey/helpers/isPostMetadataTypeAllowed";
import { isRepost } from "@hey/helpers/postHelpers";
import type { AnyPublication } from "@hey/lens";
import { H6 } from "@hey/ui";
import cn from "@hey/ui/cn";
import { getSrc } from "@livepeer/react/external";
import Link from "next/link";
import type { FC } from "react";
import { memo, useState } from "react";
import { isIOS, isMobile } from "react-device-detect";
import { usePreferencesStore } from "src/store/persisted/usePreferencesStore";
import Checkin from "./Checkin";
import EncryptedPost from "./EncryptedPost";
import Metadata from "./Metadata";
import MutedPost from "./MutedPost";
import NotSupportedPost from "./NotSupportedPost";
import Poll from "./Poll";

interface PostBodyProps {
  contentClassName?: string;
  post: AnyPublication;
  quoted?: boolean;
  showMore?: boolean;
}

const PostBody: FC<PostBodyProps> = ({
  contentClassName = "",
  post,
  quoted = false,
  showMore = false
}) => {
  const { mutedWords } = usePreferencesStore();
  const [showMutedPost, setShowMutedPost] = useState(false);

  const targetPost = isRepost(post) ? post.mirrorOn : post;
  const { id, metadata } = targetPost;

  const filteredContent = getPostData(metadata)?.content || "";
  const filteredAttachments = getPostData(metadata)?.attachments || [];
  const filteredAsset = getPostData(metadata)?.asset;

  const canShowMore = filteredContent?.length > 450 && showMore;
  const urls = getURLs(filteredContent);
  const hasURLs = urls.length > 0;

  let content = filteredContent;

  if (isIOS && isMobile && canShowMore) {
    const truncatedContent = content?.split("\n")?.[0];
    if (truncatedContent) {
      content = truncatedContent;
    }
  }

  if (targetPost.isEncrypted) {
    return <EncryptedPost />;
  }

  if (!isPostMetadataTypeAllowed(metadata.__typename)) {
    return <NotSupportedPost type={metadata.__typename} />;
  }

  // Show live if it's there
  const showLive = metadata.__typename === "LiveStreamMetadataV3";
  // Show attachments if it's there
  const showAttachments = filteredAttachments.length > 0 || filteredAsset;
  // Show poll
  const pollId = getPostAttribute(
    metadata.attributes,
    KNOWN_ATTRIBUTES.POLL_ID
  );
  const showPoll = Boolean(pollId);
  // Show sharing link
  const showSharingLink = metadata.__typename === "LinkMetadataV3";
  // Show checking in
  const showCheckin = metadata.__typename === "CheckingInMetadataV3";
  // Show quote
  const showQuote = targetPost.__typename === "Quote";
  // Show oembed if no NFT, no attachments, no quoted post
  const hideOembed =
    getPostAttribute(metadata.attributes, KNOWN_ATTRIBUTES.HIDE_OEMBED) ===
    "true";
  const showOembed =
    !hideOembed &&
    !showSharingLink &&
    !showCheckin &&
    hasURLs &&
    !showLive &&
    !showAttachments &&
    !quoted &&
    !showQuote;

  if (
    mutedWords
      ?.map((word) => word.word)
      .some((word) =>
        filteredContent.toLowerCase().includes(word.toLowerCase())
      ) &&
    !showMutedPost
  ) {
    return (
      <MutedPost
        type={targetPost.__typename}
        setShowMutedPost={setShowMutedPost}
      />
    );
  }

  return (
    <div className="break-words">
      <Markup
        className={cn(
          { "line-clamp-5": canShowMore },
          "markup linkify break-words text-md",
          contentClassName
        )}
        mentions={targetPost.profilesMentioned}
      >
        {content}
      </Markup>
      {canShowMore ? (
        <H6 className="ld-text-gray-500 mt-4 flex items-center space-x-1">
          <EyeIcon className="size-4" />
          <Link href={`/posts/${id}`}>Show more</Link>
        </H6>
      ) : null}
      {/* Attachments and Quotes */}
      {showAttachments ? (
        <Attachments asset={filteredAsset} attachments={filteredAttachments} />
      ) : null}
      {/* Poll */}
      {showPoll ? <Poll id={pollId} /> : null}
      {showLive ? (
        <div className="mt-3">
          <Video src={getSrc(metadata.liveURL || metadata.playbackURL)} />
        </div>
      ) : null}
      {showCheckin ? <Checkin post={targetPost} /> : null}
      {showOembed ? <Oembed post={targetPost} url={urls[0]} /> : null}
      {showSharingLink ? (
        <Oembed post={targetPost} url={metadata.sharingLink} />
      ) : null}
      {showQuote && <Quote post={targetPost.quoteOn} />}
      <Metadata metadata={targetPost.metadata} />
    </div>
  );
};

export default memo(PostBody);
