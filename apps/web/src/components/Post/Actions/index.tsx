import { isRepost } from "@hey/helpers/postHelpers";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { AnyPostFragment } from "@hey/indexer";
import type { FC } from "react";
import { memo } from "react";
import CollectAction from "../OpenAction/CollectAction";
import SmallCollectButton from "../OpenAction/CollectAction/SmallCollectButton";
import TipAction from "../OpenAction/TipAction";
import Comment from "./Comment";
import Like from "./Like";
import ShareMenu from "./Share";

interface PostActionsProps {
  post: AnyPostFragment;
  showCount?: boolean;
}

const PostActions: FC<PostActionsProps> = ({ post, showCount = false }) => {
  const targetPost = isRepost(post) ? post.repostOf : post;
  const hasPostAction = (targetPost.actions?.length || 0) > 0;
  const canAct =
    hasPostAction &&
    targetPost.actions.some(
      (action) => action.__typename === "SimpleCollectAction"
    );

  return (
    <span
      className="mt-3 flex w-full flex-wrap items-center justify-between gap-3"
      onClick={stopEventPropagation}
    >
      <span className="flex items-center gap-x-6">
        <Comment post={targetPost} showCount={showCount} />
        <ShareMenu post={post} showCount={showCount} />
        <Like post={targetPost} showCount={showCount} />
        {canAct && !showCount ? <CollectAction post={targetPost} /> : null}
        <TipAction post={targetPost} showCount={showCount} />
      </span>
      {canAct ? <SmallCollectButton post={targetPost} /> : null}
    </span>
  );
};

export default memo(PostActions);
