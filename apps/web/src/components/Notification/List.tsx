import { BellIcon } from "@heroicons/react/24/outline";
import { NotificationFeedType } from "@hey/data/enums";
import {
  type NotificationRequest,
  NotificationType,
  type CommentNotification as TCommentNotification,
  type FollowNotification as TFollowNotification,
  type MentionNotification as TMentionNotification,
  type QuoteNotification as TQuoteNotification,
  type ReactionNotification as TReactionNotification,
  type RepostNotification as TRepostNotification,
  useNotificationsQuery
} from "@hey/indexer";
import { Card, EmptyState, ErrorMessage } from "@hey/ui";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { usePreferencesStore } from "src/store/persisted/usePreferencesStore";
import NotificationShimmer from "./Shimmer";
import ActedNotification from "./Type/ActedNotification";
import CommentNotification from "./Type/CommentNotification";
import FollowNotification from "./Type/FollowNotification";
import MentionNotification from "./Type/MentionNotification";
import QuoteNotification from "./Type/QuoteNotification";
import ReactionNotification from "./Type/ReactionNotification";
import RepostNotification from "./Type/RepostNotification";

interface ListProps {
  feedType: string;
}

const List: FC<ListProps> = ({ feedType }) => {
  const { highSignalNotificationFilter } = usePreferencesStore();

  const getNotificationType = () => {
    switch (feedType) {
      case NotificationFeedType.All:
        return;
      case NotificationFeedType.Mentions:
        return [NotificationType.Mentioned];
      case NotificationFeedType.Comments:
        return [NotificationType.Commented];
      case NotificationFeedType.Likes:
        return [NotificationType.Reacted];
      case NotificationFeedType.Actions:
        return [NotificationType.Acted];
      default:
        return;
    }
  };

  const request: NotificationRequest = {
    filter: {
      includeLowScore: highSignalNotificationFilter,
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
              "p-5": notification.__typename !== "FollowNotification"
            })}
          >
            {notification.__typename === "FollowNotification" && (
              <FollowNotification
                notification={notification as TFollowNotification}
              />
            )}
            {notification.__typename === "MentionNotification" && (
              <MentionNotification
                notification={notification as TMentionNotification}
              />
            )}
            {notification.__typename === "ReactionNotification" && (
              <ReactionNotification
                notification={notification as TReactionNotification}
              />
            )}
            {notification.__typename === "CommentNotification" && (
              <CommentNotification
                notification={notification as TCommentNotification}
              />
            )}
            {notification.__typename === "RepostNotification" && (
              <RepostNotification
                notification={notification as TRepostNotification}
              />
            )}
            {notification.__typename === "QuoteNotification" && (
              <QuoteNotification
                notification={notification as TQuoteNotification}
              />
            )}
            {notification.__typename === "ActedNotification" && (
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
