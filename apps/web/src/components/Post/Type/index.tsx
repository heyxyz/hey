import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { AnyPostFragment } from "@hey/indexer";
import { useRouter } from "next/router";
import type { FC } from "react";
import Commented from "./Commented";
import Reposted from "./Reposted";

interface PostTypeProps {
  post: AnyPostFragment;
  showThread?: boolean;
  showType: boolean;
}

const PostType: FC<PostTypeProps> = ({
  post,
  showThread = false,
  showType
}) => {
  const { pathname } = useRouter();
  const type = post.__typename;

  if (!showType) {
    return null;
  }

  return (
    <span onClick={stopEventPropagation}>
      {type === "Repost" ? <Reposted account={post.author} /> : null}
      {type === "Post" &&
      post.commentOn &&
      (showThread || pathname === "/posts/[id]") ? (
        <Commented commentOn={post.commentOn} />
      ) : null}
    </span>
  );
};

export default PostType;
