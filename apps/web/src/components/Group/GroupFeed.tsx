import SinglePost from "@components/Post/SinglePost";
import PostsShimmer from "@components/Shared/Shimmer/PostsShimmer";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import { PageSize, type PostsRequest, usePostsQuery } from "@hey/indexer";
import { Card, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { useEffect, useRef } from "react";
import type { StateSnapshot, VirtuosoHandle } from "react-virtuoso";
import { Virtuoso } from "react-virtuoso";

let virtuosoState: any = { ranges: [], screenTop: 0 };

interface GroupFeedProps {
  feed: string;
}

const GroupFeed: FC<GroupFeedProps> = ({ feed }) => {
  const virtuoso = useRef<VirtuosoHandle>(null);

  useEffect(() => {
    virtuosoState = { ranges: [], screenTop: 0 };
  }, [feed]);

  const request: PostsRequest = {
    filter: { feeds: [{ feed }] },
    pageSize: PageSize.Fifty
  };

  const { data, error, fetchMore, loading } = usePostsQuery({
    skip: !feed,
    variables: { request }
  });

  const posts = data?.posts?.items;
  const pageInfo = data?.posts?.pageInfo;
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

  if (posts?.length === 0) {
    return (
      <EmptyState
        icon={<ChatBubbleBottomCenterIcon className="size-8" />}
        message="Group has no posts yet!"
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load group feed" />;
  }

  return (
    <Card>
      <Virtuoso
        className="virtual-divider-list-window"
        data={posts}
        endReached={onEndReached}
        isScrolling={onScrolling}
        itemContent={(index, post) => (
          <SinglePost
            isFirst={index === 0}
            isLast={index === (posts?.length || 0) - 1}
            post={post}
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

export default GroupFeed;
