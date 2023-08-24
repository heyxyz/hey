import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { UserGroupIcon } from '@heroicons/react/outline';
import type { FeedItem, FeedRequest, Publication } from '@lenster/lens';
import { FeedEventItemType, useTimelineQuery } from '@lenster/lens';
import { Card, EmptyState, ErrorMessage } from '@lenster/ui';
import { t } from '@lingui/macro';
import React, { useCallback } from 'react';
import { type FC, useRef } from 'react';
import type { StateSnapshot } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';
import { OptmisticPublicationType } from 'src/enums';
import { useAppStore } from 'src/store/app';
import { useTimelinePersistStore, useTimelineStore } from 'src/store/timeline';
import { useTransactionPersistStore } from 'src/store/transaction';

let timeLineVirtuosoState: any = { ranges: [], screenTop: 0 };

const Timeline: FC = () => {
  const timelineVirtuosoRef = useRef<any>();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const feedEventFilters = useTimelinePersistStore(
    (state) => state.feedEventFilters
  );
  const seeThroughProfile = useTimelineStore(
    (state) => state.seeThroughProfile
  );

  const getFeedEventItems = () => {
    const filters: FeedEventItemType[] = [];
    if (feedEventFilters.posts) {
      filters.push(FeedEventItemType.Post, FeedEventItemType.Comment);
    }
    if (feedEventFilters.collects) {
      filters.push(
        FeedEventItemType.CollectPost,
        FeedEventItemType.CollectComment
      );
    }
    if (feedEventFilters.mirrors) {
      filters.push(FeedEventItemType.Mirror);
    }
    if (feedEventFilters.likes) {
      filters.push(
        FeedEventItemType.ReactionPost,
        FeedEventItemType.ReactionComment
      );
    }
    return filters;
  };

  // Variables
  const request: FeedRequest = {
    profileId: seeThroughProfile?.id ?? currentProfile?.id,
    limit: 50,
    feedEventItemTypes: getFeedEventItems()
  };
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;

  const { data, loading, error, fetchMore } = useTimelineQuery({
    variables: { request, reactionRequest, profileId: currentProfile?.id }
  });

  const publications = data?.feed?.items;
  const pageInfo = data?.feed?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    await fetchMore({
      variables: {
        request: { ...request, cursor: pageInfo?.next },
        reactionRequest,
        profileId: currentProfile?.id
      }
    });
  };

  const onScrolling = useCallback((scrolling: boolean) => {
    timelineVirtuosoRef?.current?.getState((state: StateSnapshot) => {
      if (!scrolling) {
        timeLineVirtuosoState = { ...state };
      }
    });
  }, []);

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        message={t`No posts yet!`}
        icon={<UserGroupIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title={t`Failed to load timeline`} error={error} />;
  }

  const Footer = () => <PublicationsShimmer />;

  return (
    <Card>
      {txnQueue.map((txn) =>
        txn?.type === OptmisticPublicationType.NewPost ? (
          <div key={txn.id}>
            <QueuedPublication txn={txn} />
          </div>
        ) : null
      )}
      {publications && (
        <Virtuoso
          components={{ Footer }}
          restoreStateFrom={
            timeLineVirtuosoState.ranges.length === 0
              ? timelineVirtuosoRef?.current?.getState(
                  (state: StateSnapshot) => state
                )
              : timeLineVirtuosoState
          }
          ref={timelineVirtuosoRef}
          useWindowScroll
          data={publications}
          endReached={onEndReached}
          isScrolling={(scrolling) => onScrolling(scrolling)}
          itemContent={(index, publication) => {
            return (
              <div className="border-b-[1px] dark:border-gray-700">
                <SinglePublication
                  key={`${publication?.root.id}_${index}`}
                  isFirst={index === 0}
                  isLast={index === publications.length - 1}
                  feedItem={publication as FeedItem}
                  publication={publication.root as Publication}
                />
              </div>
            );
          }}
        />
      )}
    </Card>
  );
};

export default Timeline;
