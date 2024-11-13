import { FeatureFlag } from "@hey/data/feature-flags";
import getPublicationViewCountById from "@hey/helpers/getPublicationViewCountById";
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
  publication: AnyPublication;
  showCount?: boolean;
}

const PostActions: FC<PostActionsProps> = ({
  publication,
  showCount = false
}) => {
  const targetPost = isRepost(publication) ? publication.mirrorOn : publication;
  const { publicationViews } = useImpressionsStore();
  const isGardener = useFlag(FeatureFlag.Gardener);
  const hasOpenAction = (targetPost.openActionModules?.length || 0) > 0;

  const canAct =
    hasOpenAction && isOpenActionAllowed(targetPost.openActionModules);
  const views = getPublicationViewCountById(publicationViews, targetPost.id);

  return (
    <span
      className="mt-3 flex w-full flex-wrap items-center justify-between gap-3"
      onClick={stopEventPropagation}
    >
      <span className="flex items-center gap-x-6">
        <Comment publication={targetPost} showCount={showCount} />
        <ShareMenu publication={publication} showCount={showCount} />
        <Like publication={targetPost} showCount={showCount} />
        {canAct && !showCount ? <OpenAction publication={targetPost} /> : null}
        <Tip publication={targetPost} showCount={showCount} />
        {views > 0 ? <Views showCount={showCount} views={views} /> : null}
        {isGardener ? (
          <Mod isFullPublication={showCount} publication={targetPost} />
        ) : null}
      </span>
      {canAct ? <Collect publication={targetPost} /> : null}
    </span>
  );
};

export default memo(PostActions);
