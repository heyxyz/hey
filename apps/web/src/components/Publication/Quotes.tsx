import type { PublicationsRequest, Quote } from '@hey/lens';
import type { FC } from 'react';

import SinglePublication from '@components/Publication/SinglePublication';
import ProfileListShimmer from '@components/Shared/Shimmer/ProfileListShimmer';
import {
  ArrowLeftIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';
import { CustomFiltersType, LimitType, usePublicationsQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import Link from 'next/link';
import { useInView } from 'react-cool-inview';
import { useImpressionsStore } from 'src/store/non-persisted/useImpressionsStore';

interface QuotesProps {
  publicationId: string;
}

const Quotes: FC<QuotesProps> = ({ publicationId }) => {
  const { fetchAndStoreViews } = useImpressionsStore();

  // Variables
  const request: PublicationsRequest = {
    limit: LimitType.TwentyFive,
    where: {
      customFilters: [CustomFiltersType.Gardeners],
      quoteOn: publicationId
    }
  };

  const { data, error, fetchMore, loading } = usePublicationsQuery({
    onCompleted: async ({ publications }) => {
      const ids = publications?.items?.map((p) => p.id) || [];
      await fetchAndStoreViews(ids);
    },
    skip: !publicationId,
    variables: { request }
  });

  const quotes = data?.publications?.items ?? [];
  const pageInfo = data?.publications?.pageInfo;
  const hasMore = pageInfo?.next;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      const { data } = await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
      const ids = data?.publications?.items?.map((p) => p.id) || [];
      await fetchAndStoreViews(ids);
    }
  });

  if (loading) {
    return <ProfileListShimmer />;
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
        <Link href={`/posts/${publicationId}`}>
          <ArrowLeftIcon className="size-5" />
        </Link>
        <b className="text-lg">Quotes</b>
      </div>
      <div className="divider" />
      {quotes?.map((quote, index) => (
        <SinglePublication
          isFirst={false}
          isLast={index === quotes.length - 1}
          key={`${quote.id}`}
          publication={quote as Quote}
          showType={false}
        />
      ))}
      {hasMore ? <span ref={observe} /> : null}
    </Card>
  );
};

export default Quotes;
