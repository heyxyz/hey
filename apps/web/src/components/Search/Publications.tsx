import type { AnyPublication, PublicationSearchRequest } from '@hey/lens';
import type { FC } from 'react';

import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import {
  CustomFiltersType,
  LimitType,
  useSearchPublicationsQuery
} from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { useInView } from 'react-cool-inview';

interface PublicationsProps {
  query: string;
}

const Publications: FC<PublicationsProps> = ({ query }) => {
  // Variables
  const request: PublicationSearchRequest = {
    limit: LimitType.TwentyFive,
    query,
    where: { customFilters: [CustomFiltersType.Gardeners] }
  };

  const { data, error, fetchMore, loading } = useSearchPublicationsQuery({
    variables: { request }
  });

  const search = data?.searchPublications;
  const publications = search?.items as AnyPublication[];
  const pageInfo = search?.pageInfo;
  const hasMore = pageInfo?.next;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  });

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        icon={<RectangleStackIcon className="text-brand-500 size-8" />}
        message={
          <span>
            No publications for <b>&ldquo;{query}&rdquo;</b>
          </span>
        }
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load publications" />;
  }

  return (
    <>
      <Card className="divide-y-[1px] dark:divide-gray-700">
        {publications?.map((publication, index) => (
          <SinglePublication
            key={`${publication?.id}_${index}`}
            publication={publication}
          />
        ))}
      </Card>
      {hasMore ? <span ref={observe} /> : null}
    </>
  );
};

export default Publications;
