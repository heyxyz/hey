import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { CollectionIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import { SCROLL_THRESHOLD } from 'data/constants';
import type { CustomFiltersTypes, ExplorePublicationRequest, Publication, PublicationTypes } from 'lens';
import { PublicationSortCriteria, useExploreFeedQuery } from 'lens';
import type { FC } from 'react';
import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppStore } from 'src/store/app';

let hasMore = true;

interface FeedProps {
  refresh: boolean;
  setRefreshing: (refreshing: boolean) => void;
  publicationTypes: PublicationTypes[];
  customFilters: CustomFiltersTypes[];
}

const Feed: FC<FeedProps> = ({ refresh, setRefreshing, publicationTypes, customFilters }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

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

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
    }).then(({ data }) => {
      hasMore = data?.explorePublications?.items?.length > 0;
    });
  };

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
    <InfiniteScroll
      dataLength={publications?.length ?? 0}
      scrollThreshold={SCROLL_THRESHOLD}
      hasMore={hasMore}
      next={loadMore}
      loader={<span />}
    >
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
      </Card>
    </InfiniteScroll>
  );
};

export default Feed;
