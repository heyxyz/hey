import { FeatureFlag } from "@hey/data/feature-flags";
import getPostViewCountById from "@hey/helpers/getPostViewCountById";
import isOpenActionAllowed from "@hey/helpers/isOpenActionAllowed";
import { isRepost } from "@hey/helpers/postHelpers";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { AnyPublication } from "@hey/lens";
import { useFlag } from "@unleash/proxy-client-react";
import type { FC } from "react";
import { memo } from "react";
import { useImpressionsStore } from "src/store/non-persisted/useImpressionsStore";
import OpenAction from "../OpenAction";
import Collect from "../OpenAction/Collect";
import Comment from "./Comment";
import Like from "./Like";
import Mod from "./Mod";
import ShareMenu from "./Share";
import Tip from "./Tip";
import Views from "./Views";

interface PostActionsProps {
  post: AnyPublication;
  showCount?: boolean;
}

const PostActions: FC<PostActionsProps> = ({ post, showCount = false }) => {
  const targetPost = isRepost(post) ? post.mirrorOn : post;
  const { postViews } = useImpressionsStore();
  const isGardener = useFlag(FeatureFlag.Gardener);
  const hasOpenAction = (targetPost.openActionModules?.length || 0) > 0;

  const canAct =
    hasOpenAction && isOpenActionAllowed(targetPost.openActionModules);
  const views = getPostViewCountById(postViews, targetPost.id);

  return (
    <span
      className="mt-3 flex w-full flex-wrap items-center justify-between gap-3"
      onClick={stopEventPropagation}
    >
      <span className="flex items-center gap-x-6">
        <Comment post={targetPost} showCount={showCount} />
        <ShareMenu post={post} showCount={showCount} />
        <Like post={targetPost} showCount={showCount} />
        {canAct && !showCount ? <OpenAction post={targetPost} /> : null}
        <Tip post={targetPost} showCount={showCount} />
        {views > 0 ? <Views showCount={showCount} views={views} /> : null}
        {isGardener ? <Mod isFullPost={showCount} post={targetPost} /> : null}
      </span>
      {canAct ? <Collect post={targetPost} /> : null}
    </span>
  );
};

export default memo(PostActions);
