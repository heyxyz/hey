import PostWrapper from "@components/Shared/PostWrapper";
import type { PostFragment } from "@hey/indexer";
import type { FC } from "react";
import HiddenPost from "./HiddenPost";
import PostAvatar from "./PostAvatar";
import PostBody from "./PostBody";
import PostHeader from "./PostHeader";

interface QuotedPostProps {
  isNew?: boolean;
  post: PostFragment;
}

const QuotedPost: FC<QuotedPostProps> = ({ isNew = false, post }) => {
  return (
    <PostWrapper
      className="cursor-pointer p-4 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-gray-100 dark:hover:bg-gray-900"
      post={post}
    >
      <div className="flex items-center space-x-2">
        <PostAvatar post={post} quoted />
        <PostHeader isNew={isNew} post={post} quoted />
      </div>
      {post.isDeleted ? (
        <HiddenPost type={post.__typename} />
      ) : (
        <PostBody post={post} quoted showMore />
      )}
    </PostWrapper>
  );
};

export default QuotedPost;
