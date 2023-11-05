import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import type {
  AnyPublication,
  CustomFiltersType,
  ExplorePublicationRequest,
  ExplorePublicationType,
  PublicationMetadataMainFocusType
} from '@hey/lens';
import {
  ExplorePublicationsOrderByType,
  LimitType,
  useExplorePublicationsQuery
} from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import type { StateSnapshot } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';

let virtuosoState: any = { ranges: [], screenTop: 0 };

interface FeedProps {
  refresh: boolean;
  setRefreshing: (refreshing: boolean) => void;
  publicationTypes: ExplorePublicationType[];
  mainContentFocus: PublicationMetadataMainFocusType[];
  customFilters: CustomFiltersType[];
  apps: string[] | null;
}

const Feed: FC<FeedProps> = ({
  refresh,
  setRefreshing,
  publicationTypes,
  mainContentFocus,
  customFilters,
  apps
}) => {
  const virtuosoRef = useRef<any>();

  // Variables
  const request: ExplorePublicationRequest = {
    where: {
      customFilters,
      publicationTypes,
      metadata: {
        mainContentFocus,
        ...(apps && { publishedOn: apps })
      }
    },
    orderBy: ExplorePublicationsOrderByType.Latest,
    limit: LimitType.TwentyFive
  };

  const { data, loading, error, fetchMore, refetch } =
    useExplorePublicationsQuery({ variables: { request } });

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
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
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
    return (
      <ErrorMessage title="Failed to load moderation feed" error={error} />
    );
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
          data={publications}
          isScrolling={onScrolling}
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
                  showThread={false}
                  showActions={false}
                  showModActions
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
