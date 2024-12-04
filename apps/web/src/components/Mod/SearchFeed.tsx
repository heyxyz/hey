import HigherActions from "@components/Post/Actions/HigherActions";
import SinglePost from "@components/Post/SinglePost";
import PostsShimmer from "@components/Shared/Shimmer/PostsShimmer";
import { Leafwatch } from "@helpers/leafwatch";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import { GARDENER } from "@hey/data/tracking";
import { isRepost } from "@hey/helpers/postHelpers";
import {
  type AnyPost,
  PageSize,
  type Post,
  type SearchPostsRequest,
  useSearchPostsQuery
} from "@hey/indexer";
import { Button, Card, EmptyState, ErrorMessage, Input } from "@hey/ui";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { useModFilterStore } from "./Filter";

const SearchFeed: FC = () => {
  const {
    customFilters,
    mainContentFocus,
    publicationTypes,
    refresh,
    setRefreshing
  } = useModFilterStore();

  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const request: SearchPostsRequest = {
    pageSize: PageSize.Fifty,
    query,
    filter: {
      metadata: { mainContentFocus },
      postTypes: publicationTypes
    }
  };

  const { data, error, fetchMore, loading, refetch } = useSearchPostsQuery({
    skip: !query,
    variables: { request }
  });

  const search = data?.searchPosts;
  const posts = search?.items as AnyPost[];
  const pageInfo = search?.pageInfo;
  const hasMore = pageInfo?.next;

  useEffect(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refresh, publicationTypes, mainContentFocus, customFilters]);

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  return (
    <div className="space-y-5">
      <form
        className="flex items-center space-x-2"
        onSubmit={(event) => {
          event.preventDefault();
          setQuery(searchInput);
          Leafwatch.track(GARDENER.SEARCH_POST, { query: searchInput });
        }}
      >
        <Input
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search Posts"
          type="text"
          value={searchInput}
        />
        <Button size="lg">Search</Button>
      </form>
      {loading ? (
        <PostsShimmer />
      ) : !query || posts?.length === 0 ? (
        <EmptyState
          icon={<ChatBubbleBottomCenterIcon className="size-8" />}
          message="No posts yet!"
        />
      ) : error ? (
        <ErrorMessage error={error} title="Failed to load search feed" />
      ) : (
        <Virtuoso
          className="[&>div>div]:space-y-5"
          components={{ Footer: () => <div className="pb-5" /> }}
          computeItemKey={(index, post) => `${post.id}-${index}`}
          data={posts}
          endReached={onEndReached}
          itemContent={(_, post) => {
            const targetPost = isRepost(post) ? post.repostOf : post;

            return (
              <Card>
                <SinglePost
                  isFirst
                  isLast={false}
                  post={post as AnyPost}
                  showActions={false}
                  showThread={false}
                />
                <div className="divider" />
                <HigherActions post={targetPost as Post} />
              </Card>
            );
          }}
          useWindowScroll
        />
      )}
    </div>
  );
};

export default SearchFeed;
