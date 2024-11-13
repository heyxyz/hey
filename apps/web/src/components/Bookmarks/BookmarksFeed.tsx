import SinglePost from "@components/Post/SinglePost";
import PostsShimmer from "@components/Shared/Shimmer/PostsShimmer";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import type {
  AnyPublication,
  PublicationBookmarksRequest,
  PublicationMetadataMainFocusType
} from "@hey/lens";
import { LimitType, usePublicationBookmarksQuery } from "@hey/lens";
import { Card, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { useRef } from "react";
import type { StateSnapshot, VirtuosoHandle } from "react-virtuoso";
import { Virtuoso } from "react-virtuoso";
import { useImpressionsStore } from "src/store/non-persisted/useImpressionsStore";
import { useTipsStore } from "src/store/non-persisted/useTipsStore";

let virtuosoState: any = { ranges: [], screenTop: 0 };

interface BookmarksFeedProps {
  focus?: PublicationMetadataMainFocusType;
}

const BookmarksFeed: FC<BookmarksFeedProps> = ({ focus }) => {
  const { fetchAndStoreViews } = useImpressionsStore();
  const { fetchAndStoreTips } = useTipsStore();
  const virtuoso = useRef<VirtuosoHandle>(null);

  const request: PublicationBookmarksRequest = {
    limit: LimitType.TwentyFive,
    where: { metadata: { ...(focus && { mainContentFocus: [focus] }) } }
  };

  const { data, error, fetchMore, loading } = usePublicationBookmarksQuery({
    onCompleted: async ({ publicationBookmarks }) => {
      const ids =
        publicationBookmarks?.items?.map((p) => {
          return p.__typename === "Mirror" ? p.mirrorOn?.id : p.id;
        }) || [];
      await fetchAndStoreViews(ids);
      await fetchAndStoreTips(ids);
    },
    variables: { request }
  });

  const posts = data?.publicationBookmarks?.items;
  const pageInfo = data?.publicationBookmarks?.pageInfo;
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
      const { data } = await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
      const ids =
        data?.publicationBookmarks?.items?.map((p) => {
          return p.__typename === "Mirror" ? p.mirrorOn?.id : p.id;
        }) || [];
      await fetchAndStoreViews(ids);
      await fetchAndStoreTips(ids);
    }
  };

  if (loading) {
    return <PostsShimmer />;
  }

  if (posts?.length === 0) {
    return (
      <EmptyState
        icon={<BookmarkIcon className="size-8" />}
        message="No bookmarks yet!"
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load bookmark feed" />;
  }

  return (
    <Card>
      <Virtuoso
        className="virtual-divider-list-window"
        computeItemKey={(index, post) => `${post.id}-${index}`}
        data={posts}
        endReached={onEndReached}
        isScrolling={onScrolling}
        itemContent={(index, post) => (
          <SinglePost
            isFirst={index === 0}
            isLast={index === (posts?.length || 0) - 1}
            post={post as AnyPublication}
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

export default BookmarksFeed;
