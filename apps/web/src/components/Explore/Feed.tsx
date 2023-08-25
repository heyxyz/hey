import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { CollectionIcon } from '@heroicons/react/outline';
import type {
  ExplorePublicationRequest,
  Publication,
  PublicationMainFocus
} from '@lenster/lens';
import {
  CustomFiltersTypes,
  PublicationSortCriteria,
  useExploreFeedQuery
} from '@lenster/lens';
import { Card, EmptyState, ErrorMessage } from '@lenster/ui';
import { t } from '@lingui/macro';
import { type FC, useRef } from 'react';
import type { StateSnapshot } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';
import { useAppStore } from 'src/store/app';
import { useExploreStore } from 'src/store/explore';

interface FeedProps {
  focus?: PublicationMainFocus;
  feedType?: PublicationSortCriteria;
}

let exploreVirtuosoState: any = { ranges: [], screenTop: 0 };

const Feed: FC<FeedProps> = ({
  focus,
  feedType = PublicationSortCriteria.CuratedProfiles
}) => {
  const exploreVirtuosoRef = useRef<any>();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const selectedTag = useExploreStore((state) => state.selectedTag);

  // Variables
  const request: ExplorePublicationRequest = {
    sortCriteria: feedType,
    noRandomize: feedType === 'LATEST',
    customFilters: [CustomFiltersTypes.Gardeners],
    metadata: {
      ...(focus && { mainContentFocus: [focus] }),
      ...(selectedTag && { tags: { oneOf: [selectedTag] } })
    },
    limit: 10
  };
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } = useExploreFeedQuery({
    variables: { request, reactionRequest, profileId }
  });

  const publications = data?.explorePublications?.items;
  const pageInfo = data?.explorePublications?.pageInfo;
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
        message={t`No posts yet!`}
        icon={<CollectionIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage title={t`Failed to load explore feed`} error={error} />
    );
  }

  const onScrolling = (scrolling: boolean) => {
    exploreVirtuosoRef?.current?.getState((state: StateSnapshot) => {
      if (!scrolling) {
        exploreVirtuosoState = { ...state };
      }
    });
  };

  return (
    <Card
      className="divide-y-[1px] dark:divide-gray-700"
      dataTestId="explore-feed"
    >
      {publications && (
        <Virtuoso
          restoreStateFrom={
            exploreVirtuosoState.ranges.length === 0
              ? exploreVirtuosoRef?.current?.getState(
                  (state: StateSnapshot) => state
                )
              : exploreVirtuosoState
          }
          ref={exploreVirtuosoRef}
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
