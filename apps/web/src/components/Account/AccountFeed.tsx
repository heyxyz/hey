import SinglePost from "@components/Post/SinglePost";
import PostsShimmer from "@components/Shared/Shimmer/PostsShimmer";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import { AccountFeedType } from "@hey/data/enums";
import {
  type AnyPost,
  MainContentFocus,
  PageSize,
  PostType,
  type PostsRequest,
  usePostsQuery
} from "@hey/indexer";
import { Card, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { useEffect, useRef } from "react";
import type { StateSnapshot, VirtuosoHandle } from "react-virtuoso";
import { Virtuoso } from "react-virtuoso";
import { useAccountFeedStore } from "src/store/non-persisted/useAccountFeedStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";

let virtuosoState: any = { ranges: [], screenTop: 0 };

interface AccountFeedProps {
  handle: string;
  accountDetailsLoading: boolean;
  address: string;
  type:
    | AccountFeedType.Collects
    | AccountFeedType.Feed
    | AccountFeedType.Media
    | AccountFeedType.Replies;
}

const AccountFeed: FC<AccountFeedProps> = ({
  handle,
  accountDetailsLoading,
  address,
  type
}) => {
  const { currentAccount } = useAccountStore();
  const { mediaFeedFilters } = useAccountFeedStore();
  const { indexedPostHash } = useTransactionStore();
  const virtuoso = useRef<VirtuosoHandle>(null);

  useEffect(() => {
    virtuosoState = { ranges: [], screenTop: 0 };
  }, [address, handle]);

  const getMediaFilters = () => {
    const filters: MainContentFocus[] = [];
    if (mediaFeedFilters.images) {
      filters.push(MainContentFocus.Image);
    }
    if (mediaFeedFilters.video) {
      filters.push(MainContentFocus.Video);
    }
    if (mediaFeedFilters.audio) {
      filters.push(MainContentFocus.Audio);
    }
    return filters;
  };

  const postTypes: PostType[] =
    type === AccountFeedType.Feed
      ? [PostType.Root, PostType.Repost, PostType.Quote]
      : type === AccountFeedType.Replies
        ? [PostType.Comment]
        : type === AccountFeedType.Media
          ? [PostType.Root, PostType.Comment, PostType.Quote]
          : [PostType.Root, PostType.Comment, PostType.Repost, PostType.Quote];

  const metadata =
    type === AccountFeedType.Media
      ? { mainContentFocus: getMediaFilters() }
      : null;

  const request: PostsRequest = {
    pageSize: PageSize.Fifty,
    filter: { metadata, postTypes, authors: [address] }
  };

  const { data, error, fetchMore, loading, refetch } = usePostsQuery({
    skip: !address,
    variables: { request }
  });

  const posts = data?.posts?.items;
  const pageInfo = data?.posts?.pageInfo;
  const hasMore = pageInfo?.next;

  useEffect(() => {
    if (indexedPostHash && currentAccount?.address === address) {
      refetch();
    }
  }, [indexedPostHash]);

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

  if (loading || accountDetailsLoading) {
    return <PostsShimmer />;
  }

  if (posts?.length === 0) {
    const emptyMessage =
      type === AccountFeedType.Feed
        ? "has nothing in their feed yet!"
        : type === AccountFeedType.Media
          ? "has no media yet!"
          : type === AccountFeedType.Replies
            ? "hasn't replied yet!"
            : type === AccountFeedType.Collects
              ? "hasn't collected anything yet!"
              : "";

    return (
      <EmptyState
        icon={<ChatBubbleBottomCenterIcon className="size-8" />}
        message={
          <div>
            <b className="mr-1">{handle}</b>
            <span>{emptyMessage}</span>
          </div>
        }
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load profile feed" />;
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
            post={post as AnyPost}
            showThread={
              type !== AccountFeedType.Media &&
              type !== AccountFeedType.Collects
            }
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

export default AccountFeed;
