import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import type { AnyPublication, PublicationSearchRequest } from '@hey/lens';
import {
  CustomFiltersType,
  LimitType,
  useSearchPublicationsQuery
} from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import type { FC } from 'react';
import { useInView } from 'react-cool-inview';

interface PublicationsProps {
  query: string;
}

const Publications: FC<PublicationsProps> = ({ query }) => {
  // Variables
  const request: PublicationSearchRequest = {
    where: { customFilters: [CustomFiltersType.Gardeners] },
    query,
    limit: LimitType.TwentyFive
  };

  const { data, loading, error, fetchMore } = useSearchPublicationsQuery({
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
        message={
          <span>
            No publications for <b>&ldquo;{query}&rdquo;</b>
          </span>
        }
        icon={<RectangleStackIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load publications" error={error} />;
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
