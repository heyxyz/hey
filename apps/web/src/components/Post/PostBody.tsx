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
import type { AnyPostFragment } from "@hey/indexer";
import { H6 } from "@hey/ui";
import cn from "@hey/ui/cn";
import { getSrc } from "@livepeer/react/external";
import Link from "next/link";
import type { FC } from "react";
import { memo } from "react";
import { isIOS, isMobile } from "react-device-detect";
import Checkin from "./Checkin";
import Metadata from "./Metadata";
import NotSupportedPost from "./NotSupportedPost";

interface PostBodyProps {
  contentClassName?: string;
  post: AnyPostFragment;
  quoted?: boolean;
  showMore?: boolean;
}

const PostBody: FC<PostBodyProps> = ({
  contentClassName = "",
  post,
  quoted = false,
  showMore = false
}) => {
  const targetPost = isRepost(post) ? post.repostOf : post;
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

  if (!isPostMetadataTypeAllowed(metadata.__typename)) {
    return <NotSupportedPost type={metadata.__typename} />;
  }

  // Show live if it's there
  const showLive = metadata.__typename === "LivestreamMetadata";
  // Show attachments if it's there
  const showAttachments = filteredAttachments.length > 0 || filteredAsset;
  // Show sharing link
  const showSharingLink = metadata.__typename === "LinkMetadata";
  // Show checking in
  const showCheckin = metadata.__typename === "CheckingInMetadata";
  // Hide oembed if the post has the hide_oembed attribute
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
    !targetPost.quoteOf;

  return (
    <div className="break-words">
      <Markup
        className={cn(
          { "line-clamp-5": canShowMore },
          "markup linkify break-words text-md",
          contentClassName
        )}
        mentions={targetPost.mentions}
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
      {showLive ? (
        <div className="mt-3">
          <Video src={getSrc(metadata.liveUrl || metadata.playbackUrl)} />
        </div>
      ) : null}
      {showCheckin ? <Checkin post={targetPost} /> : null}
      {showOembed ? <Oembed url={urls[0]} /> : null}
      {showSharingLink ? <Oembed url={metadata.sharingLink} /> : null}
      {targetPost.quoteOf ? <Quote post={targetPost.quoteOf} /> : null}
      <Metadata metadata={targetPost.metadata} />
    </div>
  );
};

export default memo(PostBody);
