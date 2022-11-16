import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import type { LensterPublication } from '@generated/lenstertypes';
import { PublicationSortCriteria, PublicationTypes, useExploreFeedQuery } from '@generated/types';
import { CollectionIcon } from '@heroicons/react/outline';
import type { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Virtuoso } from 'react-virtuoso';
import { SCROLL_THRESHOLD } from 'src/constants';
import { useAppStore } from 'src/store/app';

const Feed: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Variables
  const request = {
    sortCriteria: PublicationSortCriteria.Latest,
    publicationTypes: [PublicationTypes.Post, PublicationTypes.Comment],
    noRandomize: true,
    limit: 10
  };
  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;

  const { data, error, fetchMore } = useExploreFeedQuery({
    variables: { request, reactionRequest, profileId }
  });

  const publications = data?.explorePublications?.items;
  const pageInfo = data?.explorePublications?.pageInfo;
  const hasMore = pageInfo?.next && publications?.length !== pageInfo.totalCount;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
    });
  };

  if (publications?.length === 0) {
    return (
      <EmptyState
        message={<div>No posts yet!</div>}
        icon={<CollectionIcon className="w-8 h-8 text-brand" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load mod feed" error={error} />;
  }

  return (
    <InfiniteScroll
      dataLength={publications?.length ?? 0}
      scrollThreshold={SCROLL_THRESHOLD}
      hasMore={hasMore}
      next={loadMore}
      loader={<div />}
    >
      <Card>
        <Virtuoso
          useWindowScroll
          className="virtual-list"
          totalCount={publications?.length}
          components={{ Footer: () => <PublicationsShimmer inVirtualList /> }}
          itemContent={(index) => {
            const publication = publications?.[index] as LensterPublication;
            return (
              <SinglePublication
                key={`${publication.id}_${index}`}
                index={index}
                publication={publication}
                showThread={false}
                showActions={false}
                showModActions
              />
            );
          }}
        />
      </Card>
    </InfiniteScroll>
  );
};

export default Feed;
