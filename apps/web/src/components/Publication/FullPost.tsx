import { QueueListIcon } from "@heroicons/react/24/outline";
import { FeatureFlag } from "@hey/data/feature-flags";
import getProfileDetails, {
  GET_PROFILE_DETAILS_QUERY_KEY
} from "@hey/helpers/api/getProfileDetails";
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
import PublicationType from "./Type";

interface FullPostProps {
  hasHiddenComments: boolean;
  publication: AnyPublication;
}

const FullPost: FC<FullPostProps> = ({ hasHiddenComments, publication }) => {
  const { setShowHiddenComments, showHiddenComments } =
    useHiddenCommentFeedStore();
  const isStaff = useFlag(FeatureFlag.Staff);

  const targetPost = isRepost(publication)
    ? publication?.mirrorOn
    : publication;

  const { by, createdAt, publishedOn } = targetPost;

  usePushToImpressions(targetPost.id);

  const { data: profileDetails } = useQuery({
    enabled: Boolean(by.id),
    queryFn: () => getProfileDetails(by.id || ""),
    queryKey: [GET_PROFILE_DETAILS_QUERY_KEY, by.id]
  });

  const isSuspended = isStaff ? false : profileDetails?.isSuspended;

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
      <PublicationType publication={publication} showType />
      <div className="flex items-start space-x-3">
        <PostAvatar publication={publication} />
        <div className="w-[calc(100%-55px)]">
          <PostHeader publication={targetPost} />
          {targetPost.isHidden ? (
            <HiddenPost type={targetPost.__typename} />
          ) : (
            <>
              <PostBody
                contentClassName="full-page-publication-markup"
                post={targetPost}
              />
              <Translate publication={targetPost} />
              <div className="ld-text-gray-500 my-3 text-sm">
                <span>{formatDate(createdAt, "hh:mm A · MMM D, YYYY")}</span>
                {publishedOn?.id ? (
                  <span> · Posted via {getAppName(publishedOn.id)}</span>
                ) : null}
              </div>
              <PostStats
                publicationId={targetPost.id}
                publicationStats={targetPost.stats}
              />
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
