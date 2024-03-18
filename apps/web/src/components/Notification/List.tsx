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
import { useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { NotificationTabType } from 'src/enums';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';
import { useNotificationStore } from 'src/store/persisted/useNotificationStore';

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
  const { latestNotificationId } = useNotificationStore();

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

  // Variables
  const request: NotificationRequest = {
    where: {
      customFilters: [CustomFiltersType.Gardeners],
      highSignalFilter: highSignalNotificationFilter,
      notificationTypes: getNotificationType()
    }
  };

  const { data, error, fetchMore, loading, refetch } = useNotificationsQuery({
    variables: { request }
  });

  const notifications = data?.notifications?.items;
  const pageInfo = data?.notifications?.pageInfo;
  const hasMore = pageInfo?.next;

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestNotificationId]);

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    return await fetchMore({
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
        computeItemKey={(_, notification) => notification.id}
        data={notifications}
        endReached={onEndReached}
        itemContent={(_, notification) => {
          return (
            <div
              className={cn({
                'p-5': notification.__typename !== 'FollowNotification'
              })}
            >
              {notification.__typename === 'FollowNotification' ? (
                <FollowNotification
                  notification={notification as FollowNotificationType}
                />
              ) : null}
              {notification.__typename === 'MentionNotification' ? (
                <MentionNotification
                  notification={notification as MentionNotificationType}
                />
              ) : null}
              {notification.__typename === 'ReactionNotification' ? (
                <ReactionNotification
                  notification={notification as ReactionNotificationType}
                />
              ) : null}
              {notification.__typename === 'CommentNotification' ? (
                <CommentNotification
                  notification={notification as CommentNotificationType}
                />
              ) : null}
              {notification.__typename === 'MirrorNotification' ? (
                <MirrorNotification
                  notification={notification as MirrorNotificationType}
                />
              ) : null}
              {notification.__typename === 'QuoteNotification' ? (
                <QuoteNotification
                  notification={notification as QuoteNotificationType}
                />
              ) : null}
              {notification.__typename === 'ActedNotification' ? (
                <ActedNotification
                  notification={notification as ActedNotificationType}
                />
              ) : null}
            </div>
          );
        }}
        useWindowScroll
      />
    </Card>
  );
};

export default List;
