import PostListShimmer from "@components/Shared/Shimmer/PostListShimmer";
import {
  ArrowLeftIcon,
  ChatBubbleBottomCenterTextIcon
} from "@heroicons/react/24/outline";
import {
  PageSize,
  type PostFragment,
  PostReferenceType,
  type PostReferencesRequest,
  usePostReferencesQuery
} from "@hey/indexer";
import { Card, EmptyState, ErrorMessage, H5 } from "@hey/ui";
import Link from "next/link";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import SinglePost from "./SinglePost";

interface QuotesProps {
  post: PostFragment;
}

const Quotes: FC<QuotesProps> = ({ post }) => {
  const request: PostReferencesRequest = {
    pageSize: PageSize.Fifty,
    referenceTypes: [PostReferenceType.QuoteOf],
    referencedPost: post.id
  };

  const { data, error, fetchMore, loading } = usePostReferencesQuery({
    skip: !post.id,
    variables: { request }
  });

  const quotes = data?.postReferences?.items ?? [];
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
    return <PostListShimmer />;
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load comment feed" />;
  }

  if (quotes.length === 0) {
    return (
      <EmptyState
        icon={<ChatBubbleBottomCenterTextIcon className="size-8" />}
        message="Be the first one to quote!"
      />
    );
  }

  return (
    <Card>
      <div className="flex items-center space-x-3 p-5">
        <Link href={`/posts/${post.id}`}>
          <ArrowLeftIcon className="size-5" />
        </Link>
        <H5>Quotes</H5>
      </div>
      <div className="divider" />
      <Virtuoso
        className="virtual-divider-list-window"
        data={quotes}
        endReached={onEndReached}
        itemContent={(index, quote) => (
          <SinglePost
            isFirst={false}
            isLast={index === quotes.length - 1}
            post={quote}
            showType={false}
          />
        )}
        useWindowScroll
      />
    </Card>
  );
};

export default Quotes;
