import HigherActions from "@components/Post/Actions/HigherActions";
import SinglePost from "@components/Post/SinglePost";
import PostsShimmer from "@components/Shared/Shimmer/PostsShimmer";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import { IS_MAINNET } from "@hey/data/constants";
import type {
  AnyPublication,
  MirrorablePublication,
  ModExplorePublicationRequest
} from "@hey/lens";
import {
  ExplorePublicationsOrderByType,
  LimitType,
  useModExplorePublicationsQuery
} from "@hey/lens";
import { Card, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { useEffect } from "react";
import { Virtuoso } from "react-virtuoso";
import { useModFilterStore } from "./Filter";

const SKIPPED_PROFILE_IDS = IS_MAINNET ? ["0x24b6"] : [];

const LatestFeed: FC = () => {
  const {
    apps,
    customFilters,
    mainContentFocus,
    publicationTypes,
    refresh,
    setRefreshing
  } = useModFilterStore();

  const request: ModExplorePublicationRequest = {
    limit: LimitType.Fifty,
    orderBy: ExplorePublicationsOrderByType.Latest,
    where: {
      customFilters,
      metadata: {
        mainContentFocus,
        ...(apps && { publishedOn: apps })
      },
      publicationTypes
    }
  };

  const { data, error, fetchMore, loading, refetch } =
    useModExplorePublicationsQuery({ variables: { request } });

  const posts = data?.modExplorePublications?.items;
  const pageInfo = data?.modExplorePublications?.pageInfo;
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

  if (loading) {
    return <PostsShimmer />;
  }

  if (posts?.length === 0) {
    return (
      <EmptyState
        icon={<ChatBubbleBottomCenterIcon className="size-8" />}
        message="No posts yet!"
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage error={error} title="Failed to load moderation feed" />
    );
  }

  return (
    <Virtuoso
      className="[&>div>div]:space-y-5"
      components={{ Footer: () => <div className="pb-5" /> }}
      computeItemKey={(index, post) => `${post.id}-${index}`}
      data={posts?.filter(
        (post) => !SKIPPED_PROFILE_IDS.includes(post?.by?.id as string)
      )}
      endReached={onEndReached}
      itemContent={(_, post) => (
        <Card>
          <SinglePost
            isFirst
            isLast={false}
            post={post as AnyPublication}
            showActions={false}
            showThread={false}
          />
          <div className="divider" />
          <HigherActions post={post as MirrorablePublication} />
        </Card>
      )}
      useWindowScroll
    />
  );
};

export default LatestFeed;
