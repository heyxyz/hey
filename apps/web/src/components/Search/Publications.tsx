import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
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
import { type FC, useRef } from 'react';
import type { StateSnapshot } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';
import { useAppStore } from 'src/store/app';

interface PublicationsProps {
  query: string | string[];
}

let searchVirtuosoState: any = { ranges: [], screenTop: 0 };

const Publications: FC<PublicationsProps> = ({ query }) => {
  const searchVirtuosoRef = useRef<any>();
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Variables
  const request: SearchQueryRequest = {
    query,
    type: SearchRequestTypes.Publication,
    customFilters: [CustomFiltersTypes.Gardeners],
    limit: 30
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
  const hasMore = pageInfo?.next;

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
        icon={<RectangleStackIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage title={t`Failed to load publications`} error={error} />
    );
  }

  const onScrolling = (scrolling: boolean) => {
    searchVirtuosoRef?.current?.getState((state: StateSnapshot) => {
      if (!scrolling) {
        searchVirtuosoState = { ...state };
      }
    });
  };

  return (
    <Card>
      {publications && (
        <Virtuoso
          restoreStateFrom={
            searchVirtuosoState.ranges.length === 0
              ? searchVirtuosoRef?.current?.getState(
                  (state: StateSnapshot) => state
                )
              : searchVirtuosoState
          }
          ref={searchVirtuosoRef}
          useWindowScroll
          data={publications}
          endReached={onEndReached}
          isScrolling={(scrolling) => onScrolling(scrolling)}
          itemContent={(index, publication) => {
            return (
              <div className="border-b-[1px] dark:border-gray-700">
                <SinglePublication
                  key={`${publication?.id}_${index}`}
                  publication={publication}
                />
              </div>
            );
          }}
        />
      )}
    </Card>
  );
};

export default Publications;
