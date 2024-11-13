import PostListShimmer from "@components/Shared/Shimmer/PostListShimmer";
import {
  ArrowLeftIcon,
  ChatBubbleBottomCenterTextIcon
} from "@heroicons/react/24/outline";
import type { PublicationsRequest, Quote } from "@hey/lens";
import { CustomFiltersType, LimitType, usePublicationsQuery } from "@hey/lens";
import { Card, EmptyState, ErrorMessage, H5 } from "@hey/ui";
import Link from "next/link";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useImpressionsStore } from "src/store/non-persisted/useImpressionsStore";
import { useTipsStore } from "src/store/non-persisted/useTipsStore";
import SinglePost from "./SinglePost";

interface QuotesProps {
  postId: string;
}

const Quotes: FC<QuotesProps> = ({ postId }) => {
  const { fetchAndStoreViews } = useImpressionsStore();
  const { fetchAndStoreTips } = useTipsStore();

  const request: PublicationsRequest = {
    limit: LimitType.TwentyFive,
    where: {
      customFilters: [CustomFiltersType.Gardeners],
      quoteOn: postId
    }
  };

  const { data, error, fetchMore, loading } = usePublicationsQuery({
    onCompleted: async ({ publications }) => {
      const ids = publications?.items?.map((p) => p.id) || [];
      await fetchAndStoreViews(ids);
      await fetchAndStoreTips(ids);
    },
    skip: !postId,
    variables: { request }
  });

  const quotes = data?.publications?.items ?? [];
  const pageInfo = data?.publications?.pageInfo;
  const hasMore = pageInfo?.next;

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
        <Link href={`/posts/${postId}`}>
          <ArrowLeftIcon className="size-5" />
        </Link>
        <H5>Quotes</H5>
      </div>
      <div className="divider" />
      <Virtuoso
        className="virtual-divider-list-window"
        computeItemKey={(index, quote) => `${quote.id}-${index}`}
        data={quotes}
        endReached={onEndReached}
        itemContent={(index, quote) => (
          <SinglePost
            isFirst={false}
            isLast={index === quotes.length - 1}
            post={quote as Quote}
            showType={false}
          />
        )}
        useWindowScroll
      />
    </Card>
  );
};

export default Quotes;
