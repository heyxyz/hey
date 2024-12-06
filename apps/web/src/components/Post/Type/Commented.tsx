import type { Post } from "@hey/indexer";
import type { FC } from "react";
import ThreadBody from "../ThreadBody";

interface CommentedProps {
  post: Post;
}

const Commented: FC<CommentedProps> = ({ post }) => {
  const commentOn = post.commentOn;
  const root = commentOn?.root;

  return (
    <>
      {root ? <ThreadBody post={root} /> : null}
      <ThreadBody post={commentOn} />
    </>
  );
};

export default Commented;
