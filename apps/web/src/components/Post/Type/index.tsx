import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { AnyPost } from "@hey/indexer";
import { useRouter } from "next/router";
import type { FC } from "react";
import Commented from "./Commented";
import Mirrored from "./Mirrored";

interface PostTypeProps {
  post: AnyPost;
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
      {type === "Repost" ? <Mirrored account={post.author} /> : null}
      {type === "Comment" && (showThread || pathname === "/posts/[id]") ? (
        <Commented post={post} />
      ) : null}
    </span>
  );
};

export default PostType;
