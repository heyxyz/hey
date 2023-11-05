import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import type { AnyPublication, ExplorePublicationRequest } from '@hey/lens';
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  LimitType,
  useExplorePublicationsQuery
} from '@hey/lens';
import type { Group } from '@hey/types/hey';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { type FC, memo } from 'react';
import { useInView } from 'react-cool-inview';
import { useImpressionsStore } from 'src/store/useImpressionsStore';

interface FeedProps {
  group: Group;
}

const Feed: FC<FeedProps> = ({ group }) => {
  const publicationViews = useImpressionsStore(
    (state) => state.publicationViews
  );
  const fetchAndStoreViews = useImpressionsStore(
    (state) => state.fetchAndStoreViews
  );

  // Variables
  const request: ExplorePublicationRequest = {
    where: {
      publicationTypes: [ExplorePublicationType.Post],
      metadata: { tags: { oneOf: group.tags } }
    },
    orderBy: ExplorePublicationsOrderByType.Latest,
    limit: LimitType.TwentyFive
  };

  const { data, loading, error, fetchMore } = useExplorePublicationsQuery({
    variables: { request },
    skip: !group.id,
    onCompleted: async ({ explorePublications }) => {
      const ids = explorePublications?.items?.map((p) => p.id) || [];
      await fetchAndStoreViews(ids);
    }
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
        message={
          <div>
            <span className="mr-1 font-bold">{group.name}</span>
            <span>don't have any publications yet</span>
          </div>
        }
        icon={<RectangleStackIcon className="text-brand-500 h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load group feed" error={error} />;
  }

  return (
    <Card className="divide-y-[1px] dark:divide-gray-700">
      {publications?.map((publication, index) => (
        <SinglePublication
          key={`${publication.id}_${index}`}
          isFirst={index === 0}
          isLast={index === publications.length - 1}
          publication={publication as AnyPublication}
        />
      ))}
      {hasMore ? <span ref={observe} /> : null}
    </Card>
  );
};

export default memo(Feed);
