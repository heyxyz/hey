import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { CollectionIcon } from '@heroicons/react/outline';
import type {
  Publication,
  PublicationSearchResult,
  SearchQueryRequest
} from '@lenster/lens';
import {
  CustomFiltersTypes,
  SearchRequestTypes,
  useSearchPublicationsQuery
} from '@lenster/lens';
import { Card, EmptyState, ErrorMessage } from '@lenster/ui';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useAppStore } from 'src/store/app';

interface PublicationsProps {
  query: string | string[];
}

const Publications: FC<PublicationsProps> = ({ query }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [hasMore, setHasMore] = useState(true);

  // Variables
  const request: SearchQueryRequest = {
    query,
    type: SearchRequestTypes.Publication,
    customFilters: [CustomFiltersTypes.Gardeners],
    limit: 10
  };
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } = useSearchPublicationsQuery({
    variables: { request, reactionRequest, profileId }
  });

  const search = data?.search as PublicationSearchResult;
  const publications = search?.items as Publication[];
  const pageInfo = search?.pageInfo;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    await fetchMore({
      variables: {
        request: { ...request, cursor: pageInfo?.next },
        reactionRequest,
        profileId
      }
    }).then(({ data }) => {
      const search = data?.search as PublicationSearchResult;
      setHasMore(search?.items?.length > 0);
    });
  };

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        message={
          <Trans>
            No publications for <b>&ldquo;{query}&rdquo;</b>
          </Trans>
        }
        icon={<CollectionIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage title={t`Failed to load publications`} error={error} />
    );
  }

  return (
    <Card>
      <Virtuoso
        useWindowScroll
        className="virtual-feed"
        data={publications}
        endReached={onEndReached}
        itemContent={(index, publication) => {
          return (
            <SinglePublication
              key={`${publication.id}_${index}`}
              isFirst={index === 0}
              isLast={index === publications.length - 1}
              publication={publication as Publication}
            />
          );
        }}
      />
    </Card>
  );
};

export default Publications;
