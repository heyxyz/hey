import type {
  AnyPublication,
  CustomFiltersType,
  ExplorePublicationRequest,
  ExplorePublicationType,
  PublicationMetadataMainFocusType
} from '@hey/lens';
import type { FC } from 'react';

import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import {
  ExplorePublicationsOrderByType,
  LimitType,
  useExplorePublicationsQuery
} from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { useEffect } from 'react';
import { useInView } from 'react-cool-inview';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';

import Actions from './Actions';

interface LatestFeedProps {
  apps: null | string[];
  customFilters: CustomFiltersType[];
  mainContentFocus: PublicationMetadataMainFocusType[];
  publicationTypes: ExplorePublicationType[];
  refresh: boolean;
  setRefreshing: (refreshing: boolean) => void;
}

const LatestFeed: FC<LatestFeedProps> = ({
  apps,
  customFilters,
  mainContentFocus,
  publicationTypes,
  refresh,
  setRefreshing
}) => {
  const trusted = useFeatureFlagsStore((state) => state.trusted);
  const gardenerMode = useFeatureFlagsStore((state) => state.gardenerMode);

  // Variables
  const request: ExplorePublicationRequest = {
    limit: LimitType.TwentyFive,
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
    useExplorePublicationsQuery({ variables: { request } });

  const publications = data?.explorePublications?.items;
  const pageInfo = data?.explorePublications?.pageInfo;
  const hasMore = pageInfo?.next;

  useEffect(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, publicationTypes, mainContentFocus, customFilters]);

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
    <div className="space-y-5">
      {publications?.map((publication, index) => (
        <Card key={`${publication.id}_${index}`}>
          <SinglePublication
            isFirst
            isLast={false}
            publication={publication as AnyPublication}
            showActions={false}
            showThread={false}
          />
          <Actions publicationId={publication.id} />
        </Card>
      ))}
      {hasMore ? <span ref={observe} /> : null}
    </div>
  );
};

export default LatestFeed;
