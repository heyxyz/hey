import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { BookmarkIcon } from '@heroicons/react/outline';
import type {
  Publication,
  PublicationMainFocus,
  PublicationsProfileBookmarkedQueryRequest
} from '@lenster/lens';
import { usePublicationsProfileBookmarksQuery } from '@lenster/lens';
import { Card, EmptyState, ErrorMessage } from '@lenster/ui';
import { t } from '@lingui/macro';
import { type FC, useRef } from 'react';
import type { StateSnapshot } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';
import { useAppStore } from 'src/store/app';

interface FeedProps {
  focus?: PublicationMainFocus;
}

let bookmarksVirtuosoState: any = { ranges: [], screenTop: 0 };

const Feed: FC<FeedProps> = ({ focus }) => {
  const bookmarksVirtuosoRef = useRef<any>();
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Variables
  const request: PublicationsProfileBookmarkedQueryRequest = {
    profileId: currentProfile?.id,
    metadata: {
      ...(focus && { mainContentFocus: [focus] })
    },
    limit: 10
  };
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } =
    usePublicationsProfileBookmarksQuery({
      variables: { request, reactionRequest, profileId }
    });

  const publications = data?.publicationsProfileBookmarks?.items;
  const pageInfo = data?.publicationsProfileBookmarks?.pageInfo;
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
        message={t`No bookmarks yet!`}
        icon={<BookmarkIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage title={t`Failed to load bookmark feed`} error={error} />
    );
  }

  const onScrolling = (scrolling: boolean) => {
    bookmarksVirtuosoRef?.current?.getState((state: StateSnapshot) => {
      if (!scrolling) {
        bookmarksVirtuosoState = { ...state };
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
            bookmarksVirtuosoState.ranges.length === 0
              ? bookmarksVirtuosoRef?.current?.getState(
                  (state: StateSnapshot) => state
                )
              : bookmarksVirtuosoState
          }
          ref={bookmarksVirtuosoRef}
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
