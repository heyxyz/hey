import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { CustomFiltersTypes, SearchRequestTypes, useSearchPublicationsQuery } from '@generated/types';
import { CollectionIcon } from '@heroicons/react/outline';
import type { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Virtuoso } from 'react-virtuoso';
import { SCROLL_THRESHOLD } from 'src/constants';
import { useAppStore } from 'src/store/app';

interface Props {
  query: string | string[];
}

const Publications: FC<Props> = ({ query }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Variables
  const request = {
    query,
    type: SearchRequestTypes.Publication,
    customFilters: [CustomFiltersTypes.Gardeners],
    limit: 10
  };
  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;

  const { data, error, fetchMore } = useSearchPublicationsQuery({
    variables: { request, reactionRequest, profileId }
  });

  // @ts-ignore
  const publications = data?.search?.items;
  // @ts-ignore
  const pageInfo = data?.search?.pageInfo;
  const hasMore = pageInfo?.next && publications?.length !== pageInfo.totalCount;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
    });
  };

  if (publications?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            No publications for <b>&ldquo;{query}&rdquo;</b>
          </div>
        }
        icon={<CollectionIcon className="w-8 h-8 text-brand" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load publications" error={error} />;
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
            const publication = publications?.[index];
            return (
              <SinglePublication
                key={`${publication?.id}_${index}`}
                index={index}
                publication={publication}
              />
            );
          }}
        />
      </Card>
    </InfiniteScroll>
  );
};

export default Publications;
