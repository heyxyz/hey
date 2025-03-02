import { QueueListIcon } from "@heroicons/react/24/outline";
import { FeatureFlag } from "@hey/data/feature-flags";
import getAccountDetails, {
  GET_ACCOUNT_DETAILS_QUERY_KEY
} from "@hey/helpers/api/getAccountDetails";
import formatDate from "@hey/helpers/datetime/formatDate";
import { isRepost } from "@hey/helpers/postHelpers";
import type { AnyPostFragment } from "@hey/indexer";
import { Card, Tooltip } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useQuery } from "@tanstack/react-query";
import { useFlag } from "@unleash/proxy-client-react";
import type { FC } from "react";
import { useHiddenCommentFeedStore } from ".";
import PostActions from "./Actions";
import HiddenPost from "./HiddenPost";
import PostAvatar from "./PostAvatar";
import PostBody from "./PostBody";
import PostHeader from "./PostHeader";
import PostStats from "./PostStats";
import PostType from "./Type";

interface FullPostProps {
  hasHiddenComments: boolean;
  post: AnyPostFragment;
}

const FullPost: FC<FullPostProps> = ({ hasHiddenComments, post }) => {
  const { setShowHiddenComments, showHiddenComments } =
    useHiddenCommentFeedStore();
  const isStaff = useFlag(FeatureFlag.Staff);

  const targetPost = isRepost(post) ? post?.repostOf : post;
  const { author, timestamp } = targetPost;

  const { data: accountDetails } = useQuery({
    enabled: Boolean(author.address),
    queryFn: () => getAccountDetails(author.address),
    queryKey: [GET_ACCOUNT_DETAILS_QUERY_KEY, author.address]
  });

  const isSuspended = isStaff ? false : accountDetails?.isSuspended;

  if (isSuspended) {
    return (
      <Card className="!bg-gray-100 dark:!bg-gray-800 m-5" forceRounded>
        <div className="px-4 py-3 text-sm">
          Author Account has been suspended!
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
          {targetPost.isDeleted ? (
            <HiddenPost type={targetPost.__typename} />
          ) : (
            <>
              <PostBody
                contentClassName="full-page-post-markup"
                post={targetPost}
              />
              <div className="ld-text-gray-500 my-3 text-sm">
                <span>{formatDate(timestamp, "hh:mm A · MMM D, YYYY")}</span>
              </div>
              <PostStats post={targetPost} />
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
