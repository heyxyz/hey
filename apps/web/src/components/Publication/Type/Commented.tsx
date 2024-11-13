import type { Comment } from "@hey/lens";
import type { FC } from "react";
import ThreadBody from "../ThreadBody";

interface CommentedProps {
  post: Comment;
}

const Commented: FC<CommentedProps> = ({ post }) => {
  const commentOn: any | Comment = post?.commentOn;
  const root = commentOn?.root;

  return (
    <>
      {root ? <ThreadBody post={root} /> : null}
      <ThreadBody post={commentOn} />
    </>
  );
};

export default Commented;
