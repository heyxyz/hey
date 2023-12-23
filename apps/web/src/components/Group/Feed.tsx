import type { AnyPublication, ExplorePublicationRequest } from '@hey/lens';
import type { Group } from '@hey/types/hey';
import type { FC } from 'react';

import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  useExplorePublicationsQuery
} from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { useInView } from 'react-cool-inview';
import { useImpressionsStore } from 'src/store/non-persisted/useImpressionsStore';

interface FeedProps {
  group: Group;
}

const Feed: FC<FeedProps> = ({ group }) => {
  const fetchAndStoreViews = useImpressionsStore(
    (state) => state.fetchAndStoreViews
  );

  // Variables
  const request: ExplorePublicationRequest = {
    limit: LimitType.TwentyFive,
    orderBy: ExplorePublicationsOrderByType.Latest,
    where: {
      metadata: { tags: { oneOf: group.tags } },
      publicationTypes: [ExplorePublicationType.Post]
    }
  };

  const { data, error, fetchMore, loading } = useExplorePublicationsQuery({
    onCompleted: async ({ explorePublications }) => {
      const ids = explorePublications?.items?.map((p) => p.id) || [];
      await fetchAndStoreViews(ids);
    },
    skip: !group.id,
    variables: { request }
  });

  const publications = data?.explorePublications?.items;
  const pageInfo = data?.explorePublications?.pageInfo;
  const hasMore = pageInfo?.next;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      const { data } = await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
      const ids = data?.explorePublications?.items?.map((p) => p.id) || [];
      await fetchAndStoreViews(ids);
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
          <div>
            <span className="mr-1 font-bold">{group.name}</span>
            <span>don't have any publications yet</span>
          </div>
        }
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load group feed" />;
  }

  return (
    <Card className="divide-y-[1px] dark:divide-gray-700">
      {publications?.map((publication, index) => (
        <SinglePublication
          isFirst={index === 0}
          isLast={index === publications.length - 1}
          key={`${publication.id}_${index}`}
          publication={publication as AnyPublication}
        />
      ))}
      {hasMore ? <span ref={observe} /> : null}
    </Card>
  );
};

export default Feed;
