import SmallSingleAccount from "@components/Shared/SmallSingleAccount";
import getCollectModuleData from "@hey/helpers/getCollectModuleData";
import getTokenImage from "@hey/helpers/getTokenImage";
import { isRepost } from "@hey/helpers/postHelpers";
import type { Post, SimpleCollectActionSettings } from "@hey/indexer";
import type { FC } from "react";

interface OpenActionPaidActionProps {
  latestActed: LatestActed[];
  post: Post;
}

const OpenActionPaidAction: FC<OpenActionPaidActionProps> = ({
  latestActed,
  post
}) => {
  const targetPost = isRepost(post) ? post.repostOf : post;

  const postActions = targetPost.actions
    .filter(
      (module) =>
        module.__typename === "MultirecipientFeeCollectOpenActionSettings" ||
        module.__typename === "SimpleCollectActionSettings"
    )
    .map((module) =>
      getCollectModuleData(
        module as
          | MultirecipientFeeCollectOpenActionSettings
          | SimpleCollectActionSettings
      )
    );

  return (
    <div className="px-5 py-3 text-sm">
      {postActions.map((postAction, index) => (
        <div
          className="flex items-center space-x-2"
          key={`${postAction?.assetAddress}_${index}}`}
        >
          <b>Collected for</b>
          <img
            alt={postAction?.assetSymbol}
            className="size-5"
            src={getTokenImage(postAction?.assetSymbol as string)}
          />
          <span>
            {postAction?.amount} {postAction?.assetSymbol}
          </span>
          <span>by</span>
          <span>
            <SmallSingleAccount
              hideSlug
              linkToAccount
              account={latestActed[0].profile}
              smallAvatar
              timestamp={latestActed[0].actedAt}
            />
          </span>
        </div>
      ))}
    </div>
  );
};

export default OpenActionPaidAction;
