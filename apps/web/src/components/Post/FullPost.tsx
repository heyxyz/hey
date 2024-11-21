import { QueueListIcon } from "@heroicons/react/24/outline";
import { FeatureFlag } from "@hey/data/feature-flags";
import getAccountDetails, {
  GET_ACCOUNT_DETAILS_QUERY_KEY
} from "@hey/helpers/api/getAccountDetails";
import formatDate from "@hey/helpers/datetime/formatDate";
import getAppName from "@hey/helpers/getAppName";
import { isRepost } from "@hey/helpers/postHelpers";
import type { AnyPublication } from "@hey/lens";
import { Card, Tooltip } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useQuery } from "@tanstack/react-query";
import { useFlag } from "@unleash/proxy-client-react";
import type { FC } from "react";
import usePushToImpressions from "src/hooks/usePushToImpressions";
import { useHiddenCommentFeedStore } from ".";
import PostActions from "./Actions";
import HiddenPost from "./HiddenPost";
import PostAvatar from "./PostAvatar";
import PostBody from "./PostBody";
import PostHeader from "./PostHeader";
import PostStats from "./PostStats";
import Translate from "./Translate";
import PostType from "./Type";

interface FullPostProps {
  hasHiddenComments: boolean;
  post: AnyPublication;
}

const FullPost: FC<FullPostProps> = ({ hasHiddenComments, post }) => {
  const { setShowHiddenComments, showHiddenComments } =
    useHiddenCommentFeedStore();
  const isStaff = useFlag(FeatureFlag.Staff);

  const targetPost = isRepost(post) ? post?.mirrorOn : post;
  const { by, createdAt, publishedOn } = targetPost;

  usePushToImpressions(targetPost.id);

  const { data: accountDetails } = useQuery({
    enabled: Boolean(by.id),
    queryFn: () => getAccountDetails(by.id || ""),
    queryKey: [GET_ACCOUNT_DETAILS_QUERY_KEY, by.id]
  });

  const isSuspended = isStaff ? false : accountDetails?.isSuspended;

  if (isSuspended) {
    return (
      <Card className="!bg-gray-100 dark:!bg-gray-800 m-5" forceRounded>
        <div className="px-4 py-3 text-sm">
          Author Profile has been suspended!
        </div>
      </Card>
    );
  }

  return (
    <article className="p-5">
      <PostType post={post} showType />
      <div className="flex items-start space-x-3">
        <PostAvatar post={post} />
        <div className="w-[calc(100%-55px)]">
          <PostHeader post={targetPost} />
          {targetPost.isHidden ? (
            <HiddenPost type={targetPost.__typename} />
          ) : (
            <>
              <PostBody
                contentClassName="full-page-post-markup"
                post={targetPost}
              />
              <Translate post={targetPost} />
              <div className="ld-text-gray-500 my-3 text-sm">
                <span>{formatDate(createdAt, "hh:mm A · MMM D, YYYY")}</span>
                {publishedOn?.id ? (
                  <span> · Posted via {getAppName(publishedOn.id)}</span>
                ) : null}
              </div>
              <PostStats postId={targetPost.id} postStats={targetPost.stats} />
              <div className="divider" />
              <div className="flex items-center justify-between">
                <PostActions post={targetPost} showCount />
                {hasHiddenComments ? (
                  <div className="mt-2">
                    <button
                      aria-label="Like"
                      className={cn(
                        showHiddenComments
                          ? "text-green-500 hover:bg-green-300/20"
                          : "ld-text-gray-500 hover:bg-gray-300/20",
                        "rounded-full p-1.5 outline-offset-2"
                      )}
                      onClick={() => setShowHiddenComments(!showHiddenComments)}
                      type="button"
                    >
                      <Tooltip
                        content={
                          showHiddenComments
                            ? "Hide hidden comments"
                            : "Show hidden comments"
                        }
                        placement="top"
                        withDelay
                      >
                        <QueueListIcon className="size-5" />
                      </Tooltip>
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default FullPost;
