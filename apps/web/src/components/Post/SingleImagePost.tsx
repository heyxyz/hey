import SmallSingleAccount from "@components/Shared/SmallSingleAccount";
import getPostData from "@hey/helpers/getPostData";
import { isRepost } from "@hey/helpers/postHelpers";
import type { AnyPostFragment } from "@hey/indexer";
import Link from "next/link";
import type { FC } from "react";
import { memo } from "react";

interface SingleImagePostProps {
  post: AnyPostFragment;
}

const SingleImagePost: FC<SingleImagePostProps> = ({ post }) => {
  const targetPost = isRepost(post) ? post.repostOf : post;
  const filteredAttachments =
    getPostData(targetPost.metadata)?.attachments || [];
  const filteredAsset = getPostData(targetPost.metadata)?.asset;
  const backgroundImage = filteredAsset?.uri || filteredAttachments[0]?.uri;

  return (
    <Link
      href={`/posts/${post.id}`}
      key={post.id}
      className="relative h-80 overflow-hidden rounded-xl bg-center bg-cover"
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      <div className="absolute inset-0 rounded-lg bg-black opacity-30" />
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 font-bold text-sm text-white">
        <SmallSingleAccount account={targetPost.author} hideSlug />
      </div>
    </Link>
  );
};

export default memo(SingleImagePost);
