import { useHiddenCommentFeedStore } from "@components/Post";
import SinglePost from "@components/Post/SinglePost";
import PostsShimmer from "@components/Shared/Shimmer/PostsShimmer";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import {
  PageSize,
  PostReferenceType,
  type PostReferencesRequest,
  PostVisibilityFilter,
  usePostReferencesQuery
} from "@hey/indexer";
import { Card, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";

interface CommentFeedProps {
  postId: string;
}

const CommentFeed: FC<CommentFeedProps> = ({ postId }) => {
  const { showHiddenComments } = useHiddenCommentFeedStore();

  const request: PostReferencesRequest = {
    pageSize: PageSize.Fifty,
    referencedPost: postId,
    referenceTypes: [PostReferenceType.CommentOn],
    visibilityFilter: showHiddenComments
      ? PostVisibilityFilter.Hidden
      : PostVisibilityFilter.Visible
  };

  const { data, error, fetchMore, loading } = usePostReferencesQuery({
    skip: !postId,
    variables: { request }
  });

  const comments = data?.postReferences?.items ?? [];
  const pageInfo = data?.postReferences?.pageInfo;
  const hasMore = pageInfo?.next;

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

  if (error) {
    return <ErrorMessage error={error} title="Failed to load comment feed" />;
  }

  if (comments?.length === 0) {
    return (
      <EmptyState
        icon={<ChatBubbleLeftIcon className="size-8" />}
        message="Be the first one to comment!"
      />
    );
  }

  return (
    <>
      <Card>
        <Virtuoso
          className="virtual-divider-list-window"
          data={comments}
          endReached={onEndReached}
          itemContent={(index, comment) => {
            if (comment.isDeleted) {
              return null;
            }

            const isFirst = index === 0;
            const isLast = index === comments.length - 1;

            return (
              <SinglePost
                isFirst={isFirst}
                isLast={isLast}
                post={comment}
                showType={false}
              />
            );
          }}
          useWindowScroll
        />
      </Card>
    </>
  );
};

export default CommentFeed;
