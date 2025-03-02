import type { PostFragment } from "@hey/indexer";
import type { FC } from "react";
import ThreadBody from "../ThreadBody";

interface CommentedProps {
  commentOn: PostFragment;
}

const Commented: FC<CommentedProps> = ({ commentOn }) => {
  return <ThreadBody post={commentOn} />;
};

export default Commented;
