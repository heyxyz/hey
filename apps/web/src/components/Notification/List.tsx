import type {
  ActedNotification as ActedNotificationType,
  CommentNotification as CommentNotificationType,
  FollowNotification as FollowNotificationType,
  MentionNotification as MentionNotificationType,
  MirrorNotification as MirrorNotificationType,
  NotificationRequest,
  QuoteNotification as QuoteNotificationType,
  ReactionNotification as ReactionNotificationType
} from '@hey/lens';
import type { FC } from 'react';

import { BellIcon } from '@heroicons/react/24/outline';
import {
  CustomFiltersType,
  NotificationType,
  useNotificationsQuery
} from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import cn from '@hey/ui/cn';
import { Virtuoso } from 'react-virtuoso';
import { NotificationTabType } from 'src/enums';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';

import NotificationShimmer from './Shimmer';
import ActedNotification from './Type/ActedNotification';
import CommentNotification from './Type/CommentNotification';
import FollowNotification from './Type/FollowNotification';
import MentionNotification from './Type/MentionNotification';
import MirrorNotification from './Type/MirrorNotification';
import QuoteNotification from './Type/QuoteNotification';
import ReactionNotification from './Type/ReactionNotification';

interface ListProps {
  feedType: string;
}

const List: FC<ListProps> = ({ feedType }) => {
  const { highSignalNotificationFilter } = usePreferencesStore();

  const getNotificationType = () => {
    switch (feedType) {
      case NotificationTabType.All:
        return;
      case NotificationTabType.Mentions:
        return [NotificationType.Mentioned];
      case NotificationTabType.Comments:
        return [NotificationType.Commented];
      case NotificationTabType.Likes:
        return [NotificationType.Reacted];
      case NotificationTabType.Collects:
        return [NotificationType.Acted];
      default:
        return;
    }
  };

  const request: NotificationRequest = {
    where: {
      customFilters: [CustomFiltersType.Gardeners],
      highSignalFilter: highSignalNotificationFilter,
      notificationTypes: getNotificationType()
    }
  };

  const { data, error, fetchMore, loading } = useNotificationsQuery({
    variables: { request }
  });

  const notifications = data?.notifications?.items;
  const pageInfo = data?.notifications?.pageInfo;
  const hasMore = !!pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo.next } }
      });
    }
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
    return <ErrorMessage error={error} title="Failed to load notifications" />;
  }

  if (notifications?.length === 0) {
    return (
      <EmptyState
        icon={<BellIcon className="size-8" />}
        message="Inbox zero!"
      />
    );
  }

  return (
    <Card>
      <Virtuoso
        className="virtual-notification-list"
        computeItemKey={(index, notification) => `${notification.id}-${index}`}
        data={notifications}
        endReached={onEndReached}
        itemContent={(_, notification) => (
          <div
            className={cn({
              'p-5': notification.__typename !== 'FollowNotification'
            })}
          >
            {notification.__typename === 'FollowNotification' && (
              <FollowNotification
                notification={notification as FollowNotificationType}
              />
            )}
            {notification.__typename === 'MentionNotification' && (
              <MentionNotification
                notification={notification as MentionNotificationType}
              />
            )}
            {notification.__typename === 'ReactionNotification' && (
              <ReactionNotification
                notification={notification as ReactionNotificationType}
              />
            )}
            {notification.__typename === 'CommentNotification' && (
              <CommentNotification
                notification={notification as CommentNotificationType}
              />
            )}
            {notification.__typename === 'MirrorNotification' && (
              <MirrorNotification
                notification={notification as MirrorNotificationType}
              />
            )}
            {notification.__typename === 'QuoteNotification' && (
              <QuoteNotification
                notification={notification as QuoteNotificationType}
              />
            )}
            {notification.__typename === 'ActedNotification' && (
              <ActedNotification
                notification={notification as ActedNotificationType}
              />
            )}
          </div>
        )}
        useWindowScroll
      />
    </Card>
  );
};

export default List;
