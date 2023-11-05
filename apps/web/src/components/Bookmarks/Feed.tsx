import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import type {
  AnyPublication,
  PublicationBookmarksRequest,
  PublicationMetadataMainFocusType
} from '@hey/lens';
import { LimitType, usePublicationBookmarksQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import { type FC, useRef } from 'react';
import type { StateSnapshot } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';
import { useImpressionsStore } from 'src/store/useImpressionsStore';

let virtuosoState: any = { ranges: [], screenTop: 0 };

interface FeedProps {
  focus?: PublicationMetadataMainFocusType;
}

const Feed: FC<FeedProps> = ({ focus }) => {
  const fetchAndStoreViews = useImpressionsStore(
    (state) => state.fetchAndStoreViews
  );

  const virtuosoRef = useRef<any>();

  // Variables
  const request: PublicationBookmarksRequest = {
    where: { metadata: { ...(focus && { mainContentFocus: [focus] }) } },
    limit: LimitType.TwentyFive
  };

  const { data, loading, error, fetchMore } = usePublicationBookmarksQuery({
    variables: { request },
    onCompleted: async ({ publicationBookmarks }) => {
      const ids =
        publicationBookmarks?.items?.map((p) => {
          return p.__typename === 'Mirror' ? p.mirrorOn?.id : p.id;
        }) || [];
      await fetchAndStoreViews(ids);
    }
  });

  const publications = data?.publicationBookmarks?.items;
  const pageInfo = data?.publicationBookmarks?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    const { data } = await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
    const ids =
      data?.publicationBookmarks?.items?.map((p) => {
        return p.__typename === 'Mirror' ? p.mirrorOn?.id : p.id;
      }) || [];
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
        message="No bookmarks yet!"
        icon={<BookmarkIcon className="text-brand-500 h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load bookmark feed" error={error} />;
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
