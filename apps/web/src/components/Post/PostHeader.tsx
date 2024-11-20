import { XMarkIcon } from "@heroicons/react/24/outline";
import { isRepost } from "@hey/helpers/postHelpers";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { AnyPublication, FeedItem } from "@hey/lens";
import type { FC } from "react";
import { usePostStore } from "src/store/non-persisted/post/usePostStore";
import PostMenu from "./Actions/Menu";
import PostAccount from "./PostAccount";

interface PostHeaderProps {
  feedItem?: FeedItem;
  isNew?: boolean;
  post: AnyPublication;
  quoted?: boolean;
}

const PostHeader: FC<PostHeaderProps> = ({
  feedItem,
  isNew = false,
  post,
  quoted = false
}) => {
  const { setQuotedPost } = usePostStore();

  const targetPost = isRepost(post) ? post?.mirrorOn : post;
  const rootPublication = feedItem ? feedItem?.root : targetPost;
  const account = feedItem ? rootPublication.by : targetPost.by;
  const timestamp = feedItem ? rootPublication.createdAt : targetPost.createdAt;

  return (
    <div
      className="flex w-full items-start justify-between"
      onClick={stopEventPropagation}
    >
      <PostAccount
        account={account}
        postId={targetPost.id}
        source={targetPost.publishedOn?.id}
        tags={targetPost.metadata?.tags || []}
        timestamp={timestamp}
      />
      {!post.isHidden && !quoted ? (
        <PostMenu post={targetPost} />
      ) : (
        <div className="size-[30px]" />
      )}
      {quoted && isNew ? (
        <button
          aria-label="Remove Quote"
          className="rounded-full border p-1.5 hover:bg-gray-300/20"
          onClick={() => setQuotedPost(null)}
          type="reset"
        >
          <XMarkIcon className="ld-text-gray-500 size-4" />
        </button>
      ) : null}
    </div>
  );
};

export default PostHeader;
