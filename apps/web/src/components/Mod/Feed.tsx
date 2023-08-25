import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { CollectionIcon } from '@heroicons/react/outline';
import type {
  CustomFiltersTypes,
  ExplorePublicationRequest,
  Publication,
  PublicationMainFocus,
  PublicationTypes
} from '@lenster/lens';
import { PublicationSortCriteria, useExploreFeedQuery } from '@lenster/lens';
import { Card, EmptyState, ErrorMessage } from '@lenster/ui';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import type { StateSnapshot } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';
import { useAppStore } from 'src/store/app';

let modFeedVirtuosoState: any = { ranges: [], screenTop: 0 };

interface FeedProps {
  refresh: boolean;
  setRefreshing: (refreshing: boolean) => void;
  publicationTypes: PublicationTypes[];
  mainContentFocus: PublicationMainFocus[];
  customFilters: CustomFiltersTypes[];
}

const Feed: FC<FeedProps> = ({
  refresh,
  setRefreshing,
  publicationTypes,
  mainContentFocus,
  customFilters
}) => {
  const modFeedVirtuosoRef = useRef<any>();
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Variables
  const request: ExplorePublicationRequest = {
    sortCriteria: PublicationSortCriteria.Latest,
    noRandomize: true,
    publicationTypes,
    metadata: {
      mainContentFocus
    },
    customFilters,
    limit: 50
  };
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore, refetch } = useExploreFeedQuery({
    variables: { request, reactionRequest, profileId }
  });

  const publications = data?.explorePublications?.items;
  const pageInfo = data?.explorePublications?.pageInfo;
  const hasMore = pageInfo?.next;

  useEffect(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, publicationTypes, mainContentFocus, customFilters]);

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
        message={t`No posts yet!`}
        icon={<CollectionIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage title={t`Failed to load moderation feed`} error={error} />
    );
  }

  const onScrolling = (scrolling: boolean) => {
    modFeedVirtuosoRef?.current?.getState((state: StateSnapshot) => {
      if (!scrolling) {
        modFeedVirtuosoState = { ...state };
      }
    });
  };

  return (
    <Card>
      {publications && (
        <Virtuoso
          restoreStateFrom={
            modFeedVirtuosoState.ranges.length === 0
              ? modFeedVirtuosoRef?.current?.getState(
                  (state: StateSnapshot) => state
                )
              : modFeedVirtuosoState
          }
          ref={modFeedVirtuosoRef}
          useWindowScroll
          data={publications}
          endReached={onEndReached}
          isScrolling={(scrolling) => onScrolling(scrolling)}
          itemContent={(index, publication) => {
            return (
              <div className="border-b-[1px] dark:border-gray-700">
                <SinglePublication
                  key={`${publication.id}_${index}`}
                  isFirst={index === 0}
                  isLast={index === publications.length - 1}
                  publication={publication as Publication}
                  showThread={false}
                  showActions={false}
                  showModActions
                />
              </div>
            );
          }}
        />
      )}
    </Card>
  );
};

export default Feed;
