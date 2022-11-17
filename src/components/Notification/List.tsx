import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import InfiniteLoader from '@components/UI/InfiniteLoader';
import type {
  NewCollectNotification,
  NewCommentNotification,
  NewFollowerNotification,
  NewMentionNotification,
  NewMirrorNotification,
  NewReactionNotification
} from '@generated/types';
import { CustomFiltersTypes, NotificationTypes, useNotificationsQuery } from '@generated/types';
import { LightningBoltIcon } from '@heroicons/react/outline';
import type { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SCROLL_THRESHOLD } from 'src/constants';
import { useAppStore } from 'src/store/app';

import NotificationShimmer from './Shimmer';
import CollectNotification from './Type/CollectNotification';
import CommentNotification from './Type/CommentNotification';
import FollowerNotification from './Type/FollowerNotification';
import LikeNotification from './Type/LikeNotification';
import MentionNotification from './Type/MentionNotification';
import MirrorNotification from './Type/MirrorNotification';

interface Props {
  feedType: 'ALL' | 'MENTIONS' | 'COMMENTS';
}

const List: FC<Props> = ({ feedType }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const getNotificationType = () => {
    switch (feedType) {
      case 'ALL':
        return;
      case 'MENTIONS':
        return [NotificationTypes.MentionPost, NotificationTypes.MentionComment];
      case 'COMMENTS':
        return [NotificationTypes.CommentedComment, NotificationTypes.CommentedPost];
      default:
        return;
    }
  };

  // Variables
  const request = {
    profileId: currentProfile?.id,
    customFilters: [CustomFiltersTypes.Gardeners],
    notificationTypes: getNotificationType(),
    limit: 20
  };

  const { data, loading, error, fetchMore } = useNotificationsQuery({
    variables: { request }
  });

  const notifications = data?.notifications?.items;
  const pageInfo = data?.notifications?.pageInfo;
  const hasMore = pageInfo?.next && notifications?.length !== pageInfo.totalCount;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  if (loading) {
    return (
      <Card className="divide-y dark:divide-gray-700">
        <NotificationShimmer />
        <NotificationShimmer />
        <NotificationShimmer />
        <NotificationShimmer />
      </Card>
    );
  }

  if (error) {
    return <ErrorMessage className="m-3" title="Failed to load notifications" error={error} />;
  }

  if (notifications?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <span>Inbox zero!</span>
          </div>
        }
        icon={<LightningBoltIcon className="w-8 h-8 text-brand" />}
        hideCard
      />
    );
  }

  return (
    <InfiniteScroll
      dataLength={notifications?.length ?? 0}
      scrollThreshold={SCROLL_THRESHOLD}
      hasMore={hasMore}
      next={loadMore}
      loader={<InfiniteLoader />}
    >
      <Card className="divide-y dark:divide-gray-700">
        {notifications?.map((notification, index: number) => (
          <div key={`${notification?.notificationId}_${index}`} className="p-5">
            {notification.__typename === 'NewFollowerNotification' && (
              <FollowerNotification notification={notification as NewFollowerNotification} />
            )}
            {notification.__typename === 'NewMentionNotification' && (
              <MentionNotification notification={notification as NewMentionNotification} />
            )}
            {notification.__typename === 'NewReactionNotification' && (
              <LikeNotification notification={notification as NewReactionNotification} />
            )}
            {notification.__typename === 'NewCommentNotification' && (
              <CommentNotification notification={notification as NewCommentNotification} />
            )}
            {notification.__typename === 'NewMirrorNotification' && (
              <MirrorNotification notification={notification as NewMirrorNotification} />
            )}
            {notification.__typename === 'NewCollectNotification' && (
              <CollectNotification notification={notification as NewCollectNotification} />
            )}
          </div>
        ))}
      </Card>
    </InfiniteScroll>
  );
};

export default List;
