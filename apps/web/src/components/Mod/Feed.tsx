import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { CollectionIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { CustomFiltersTypes, ExplorePublicationRequest, Publication, PublicationTypes } from 'lens';
import { PublicationSortCriteria, useExploreFeedQuery } from 'lens';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useInView } from 'react-cool-inview';
import { useAppStore } from 'src/store/app';

interface FeedProps {
  refresh: boolean;
  setRefreshing: (refreshing: boolean) => void;
  publicationTypes: PublicationTypes[];
  customFilters: CustomFiltersTypes[];
}

const Feed: FC<FeedProps> = ({ refresh, setRefreshing, publicationTypes, customFilters }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [hasMore, setHasMore] = useState(true);

  // Variables
  const request: ExplorePublicationRequest = {
    sortCriteria: PublicationSortCriteria.Latest,
    noRandomize: true,
    publicationTypes,
    customFilters,
    limit: 50
  };
  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore, refetch } = useExploreFeedQuery({
    variables: { request, reactionRequest, profileId }
  });

  const publications = data?.explorePublications?.items;
  const pageInfo = data?.explorePublications?.pageInfo;

  useEffect(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, publicationTypes, customFilters]);

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
      }).then(({ data }) => {
        setHasMore(data?.explorePublications?.items?.length > 0);
      });
    }
  });

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return <EmptyState message={t`No posts yet!`} icon={<CollectionIcon className="text-brand h-8 w-8" />} />;
  }

  if (error) {
    return <ErrorMessage title={t`Failed to load moderation feed`} error={error} />;
  }

  return (
    <Card className="divide-y-[1px] dark:divide-gray-700">
      {publications?.map((publication, index) => (
        <SinglePublication
          key={`${publication.id}_${index}`}
          publication={publication as Publication}
          showThread={false}
          showActions={false}
          showModActions
        />
      ))}
      {hasMore && <span ref={observe} />}
    </Card>
  );
};

export default Feed;
