import { useHiddenCommentFeedStore } from "@components/Post";
import SinglePost from "@components/Post/SinglePost";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import getAvatar from "@hey/helpers/getAvatar";
import type { Comment, PublicationsRequest } from "@hey/lens";
import {
  CommentRankingFilterType,
  CustomFiltersType,
  HiddenCommentsType,
  LimitType,
  usePublicationsQuery
} from "@hey/lens";
import { Card, StackedAvatars } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { useImpressionsStore } from "src/store/non-persisted/useImpressionsStore";
import { useTipsStore } from "src/store/non-persisted/useTipsStore";

interface NoneRelevantFeedProps {
  postId: string;
}

const NoneRelevantFeed: FC<NoneRelevantFeedProps> = ({ postId }) => {
  const { showHiddenComments } = useHiddenCommentFeedStore();
  const [showMore, setShowMore] = useState(false);
  const { fetchAndStoreViews } = useImpressionsStore();
  const { fetchAndStoreTips } = useTipsStore();

  const request: PublicationsRequest = {
    limit: LimitType.TwentyFive,
    where: {
      commentOn: {
        hiddenComments: showHiddenComments
          ? HiddenCommentsType.HiddenOnly
          : HiddenCommentsType.Hide,
        id: postId,
        ranking: { filter: CommentRankingFilterType.NoneRelevant }
      },
      customFilters: [CustomFiltersType.Gardeners]
    }
  };

  const { data, fetchMore } = usePublicationsQuery({
    onCompleted: async ({ publications }) => {
      const ids = publications?.items?.map((p) => p.id) || [];
      await fetchAndStoreViews(ids);
      await fetchAndStoreTips(ids);
    },
    skip: !postId,
    variables: { request }
  });

  const comments = data?.publications?.items ?? [];
  const pageInfo = data?.publications?.pageInfo;
  const hasMore = pageInfo?.next;
  const totalComments = comments?.length;

  const onEndReached = async () => {
    if (hasMore) {
      const { data } = await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
      const ids = data?.publications?.items?.map((p) => p.id) || [];
      await fetchAndStoreViews(ids);
      await fetchAndStoreTips(ids);
    }
  };

  if (totalComments === 0) {
    return null;
  }

  return (
    <>
      <Card
        className="flex cursor-pointer items-center justify-center space-x-2.5 p-5"
        onClick={() => setShowMore(!showMore)}
      >
        <StackedAvatars
          avatars={comments.map((comment) => getAvatar(comment.by))}
          limit={5}
        />
        <div>{showMore ? "Hide more comments" : "Show more comments"}</div>
        {showMore ? (
          <ChevronUpIcon className="size-4" />
        ) : (
          <ChevronDownIcon className="size-4" />
        )}
      </Card>
      {showMore ? (
        <Card>
          <Virtuoso
            className="virtual-divider-list-window"
            computeItemKey={(index, comment) =>
              `${postId}-${comment.id}-${index}`
            }
            data={comments}
            endReached={onEndReached}
            itemContent={(index, comment) => {
              if (comment.__typename !== "Comment" || comment.isHidden) {
                return null;
              }

              const isFirst = index === 0;
              const isLast = index === comments.length - 1;

              return (
                <SinglePost
                  isFirst={isFirst}
                  isLast={isLast}
                  post={comment as Comment}
                  showType={false}
                />
              );
            }}
            useWindowScroll
          />
        </Card>
      ) : null}
    </>
  );
};

export default NoneRelevantFeed;
