import type { Comment } from "@hey/lens";
import type { FC } from "react";
import ThreadBody from "../ThreadBody";

interface CommentedProps {
  publication: Comment;
}

const Commented: FC<CommentedProps> = ({ publication }) => {
  const commentOn: any | Comment = publication?.commentOn;
  const root = commentOn?.root;

  return (
    <>
      {root ? <ThreadBody post={root} /> : null}
      <ThreadBody post={commentOn} />
    </>
  );
};

export default Commented;
