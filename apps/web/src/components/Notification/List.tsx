import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { LightningBoltIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type {
  NewCollectNotification,
  NewCommentNotification,
  NewFollowerNotification,
  NewMentionNotification,
  NewMirrorNotification,
  NewReactionNotification,
  NotificationRequest
} from 'lens';
import { CustomFiltersTypes, NotificationTypes, useNotificationsQuery } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';
import { useAppStore } from 'src/store/app';
import { Card } from 'ui/Card';

import NotificationShimmer from './Shimmer';
import CollectNotification from './Type/CollectNotification';
import CommentNotification from './Type/CommentNotification';
import FollowerNotification from './Type/FollowerNotification';
import LikeNotification from './Type/LikeNotification';
import MentionNotification from './Type/MentionNotification';
import MirrorNotification from './Type/MirrorNotification';

export enum NotificationType {
  All = 'ALL',
  Mentions = 'MENTIONS',
  Comments = 'COMMENTS',
  Likes = 'LIKES',
  Collects = 'COLLECTS'
}

interface ListProps {
  feedType: string;
}

const List: FC<ListProps> = ({ feedType }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [hasMore, setHasMore] = useState(true);

  const getNotificationType = () => {
    switch (feedType) {
      case NotificationType.All:
        return;
      case NotificationType.Mentions:
        return [NotificationTypes.MentionPost, NotificationTypes.MentionComment];
      case NotificationType.Comments:
        return [NotificationTypes.CommentedPost, NotificationTypes.CommentedComment];
      case NotificationType.Likes:
        return [NotificationTypes.ReactionPost, NotificationTypes.ReactionComment];
      case NotificationType.Collects:
        return [NotificationTypes.CollectedPost, NotificationTypes.CollectedComment];
      default:
        return;
    }
  };

  // Variables
  const request: NotificationRequest = {
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

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      }).then(({ data }) => {
        setHasMore(data?.notifications?.items?.length > 0);
      });
    }
  });

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
    return <ErrorMessage className="m-3" title={t`Failed to load notifications`} error={error} />;
  }

  if (notifications?.length === 0) {
    return (
      <EmptyState
        message={t`Inbox zero!`}
        icon={<LightningBoltIcon className="text-brand h-8 w-8" />}
        hideCard
      />
    );
  }

  return (
    <Card className="divide-y dark:divide-gray-700">
      {notifications?.map((notification, index, items) => {
        const isLast = index === items.length - 1;

        return (
          <div
            key={`${notification?.notificationId}_${index}`}
            className="p-5"
            ref={isLast ? observe : undefined}
          >
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
        );
      })}
    </Card>
  );
};

export default List;
