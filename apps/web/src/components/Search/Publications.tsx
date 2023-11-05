import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import type { AnyPublication, PublicationSearchRequest } from '@hey/lens';
import {
  CustomFiltersType,
  LimitType,
  useSearchPublicationsQuery
} from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import { type FC, useRef } from 'react';
import type { StateSnapshot } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';

let virtuosoState: any = { ranges: [], screenTop: 0 };

interface PublicationsProps {
  query: string;
}

const Publications: FC<PublicationsProps> = ({ query }) => {
  const virtuosoRef = useRef<any>();

  // Variables
  const request: PublicationSearchRequest = {
    where: { customFilters: [CustomFiltersType.Gardeners] },
    query,
    limit: LimitType.TwentyFive
  };

  const { data, loading, error, fetchMore } = useSearchPublicationsQuery({
    variables: { request }
  });

  const search = data?.searchPublications;
  const publications = search?.items as AnyPublication[];
  const pageInfo = search?.pageInfo;
  const hasMore = pageInfo?.next;

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
        message={
          <span>
            No publications for <b>&ldquo;{query}&rdquo;</b>
          </span>
        }
        icon={<RectangleStackIcon className="text-brand-500 h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load publications" error={error} />;
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
                  key={`${publication?.id}_${index}`}
                  publication={publication}
                />
              </motion.div>
            );
          }}
        />
      ) : null}
    </Card>
  );
};

export default Publications;
