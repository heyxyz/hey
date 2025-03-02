import SinglePost from "@components/Post/SinglePost";
import PostsShimmer from "@components/Shared/Shimmer/PostsShimmer";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { type TimelineRequest, useTimelineQuery } from "@hey/indexer";
import { Card, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { memo, useRef } from "react";
import type { StateSnapshot, VirtuosoHandle } from "react-virtuoso";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";

let virtuosoState: any = { ranges: [], screenTop: 0 };

const Timeline: FC = () => {
  const { currentAccount } = useAccountStore();
  const virtuoso = useRef<VirtuosoHandle>(null);

  const request: TimelineRequest = {
    account: currentAccount?.address
  };

  const { data, error, fetchMore, loading } = useTimelineQuery({
    fetchPolicy: "cache-and-network",
    variables: { request }
  });

  const feed = data?.timeline?.items;
  const pageInfo = data?.timeline?.pageInfo;
  const hasMore = pageInfo?.next;

  const onScrolling = (scrolling: boolean) => {
    if (!scrolling) {
      virtuoso?.current?.getState((state: StateSnapshot) => {
        virtuosoState = { ...state };
      });
    }
  };

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  if (loading) {
    return <PostsShimmer />;
  }

  if (feed?.length === 0) {
    return (
      <EmptyState
        icon={<UserGroupIcon className="size-8" />}
        message="No posts yet!"
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load timeline" />;
  }

  return (
    <Card>
      <Virtuoso
        className="virtual-divider-list-window"
        data={feed}
        endReached={onEndReached}
        isScrolling={onScrolling}
        itemContent={(index, timelineItem) => (
          <SinglePost
            timelineItem={timelineItem}
            isFirst={index === 0}
            isLast={index === (feed?.length || 0) - 1}
            post={timelineItem.primary}
          />
        )}
        ref={virtuoso}
        restoreStateFrom={
          virtuosoState.ranges.length === 0
            ? virtuosoState?.current?.getState((state: StateSnapshot) => state)
            : virtuosoState
        }
        useWindowScroll
      />
    </Card>
  );
};

export default memo(Timeline);
