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
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import { type FC, useRef } from 'react';
import type { StateSnapshot } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';
import { useImpressionsStore } from 'src/store/useImpressionsStore';

let virtuosoState: any = { ranges: [], screenTop: 0 };

interface FeedProps {
  focus?: PublicationMetadataMainFocusType;
  feedType?: ExplorePublicationsOrderByType;
}

const Feed: FC<FeedProps> = ({
  focus,
  feedType = ExplorePublicationsOrderByType.LensCurated
}) => {
  const fetchAndStoreViews = useImpressionsStore(
    (state) => state.fetchAndStoreViews
  );

  const virtuosoRef = useRef<any>();

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

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    const { data } = await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
    const ids = data?.explorePublications?.items?.map((p) => p.id) || [];
    await fetchAndStoreViews(ids);
  };

  const onScrolling = (scrolling: boolean) => {
    virtuosoRef?.current?.getState((state: StateSnapshot) => {
      if (!scrolling) {
        virtuosoState = { ...state };
      }
    });
  };

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
      {publications?.length ? (
        <Virtuoso
          useWindowScroll
          restoreStateFrom={
            virtuosoState.ranges.length === 0
              ? virtuosoRef?.current?.getState((state: StateSnapshot) => state)
              : virtuosoState
          }
          ref={virtuosoRef}
          isScrolling={(scrolling) => onScrolling(scrolling)}
          data={publications}
          endReached={onEndReached}
          className="virtual-feed-list"
          itemContent={(index, publication) => {
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SinglePublication
                  key={`${publication.id}_${index}`}
                  isFirst={index === 0}
                  isLast={index === publications.length - 1}
                  publication={publication as AnyPublication}
                />
              </motion.div>
            );
          }}
        />
      ) : null}
    </Card>
  );
};

export default Feed;
