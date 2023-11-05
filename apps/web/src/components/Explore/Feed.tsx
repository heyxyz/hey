import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import type {
  AnyPublication,
  ExplorePublicationRequest,
  PublicationMetadataMainFocusType
} from '@hey/lens';
import {
  CustomFiltersType,
  ExplorePublicationsOrderByType,
  LimitType,
  useExplorePublicationsQuery
} from '@hey/lens';
import getPublicationViewCountById from '@hey/lib/getPublicationViewCountById';
import type { PublicationViewCount } from '@hey/types/hey';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import getPublicationsViews from '@lib/getPublicationsViews';
import { type FC, useState } from 'react';
import { useInView } from 'react-cool-inview';

interface FeedProps {
  focus?: PublicationMetadataMainFocusType;
  feedType?: ExplorePublicationsOrderByType;
}

const Feed: FC<FeedProps> = ({
  focus,
  feedType = ExplorePublicationsOrderByType.LensCurated
}) => {
  const [views, setViews] = useState<PublicationViewCount[] | []>([]);

  const fetchAndStoreViews = async (ids: string[]) => {
    if (ids.length) {
      const viewsResponse = await getPublicationsViews(ids);
      setViews((prev) => [...prev, ...viewsResponse]);
    }
  };

  // Variables
  const request: ExplorePublicationRequest = {
    where: {
      customFilters: [CustomFiltersType.Gardeners],
      metadata: { ...(focus && { mainContentFocus: [focus] }) }
    },
    orderBy: feedType,
    limit: LimitType.TwentyFive
  };

  const { data, loading, error, fetchMore } = useExplorePublicationsQuery({
    variables: { request },
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
        message="No posts yet!"
        icon={<RectangleStackIcon className="text-brand-500 h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load explore feed" error={error} />;
  }

  return (
    <Card className="divide-y-[1px] dark:divide-gray-700">
      {publications?.map((publication, index) => (
        <SinglePublication
          key={`${publication.id}_${index}`}
          isFirst={index === 0}
          isLast={index === publications.length - 1}
          publication={publication as AnyPublication}
          views={getPublicationViewCountById(
            views,
            publication as AnyPublication
          )}
        />
      ))}
      {hasMore ? <span ref={observe} /> : null}
    </Card>
  );
};

export default Feed;
