import { gql, useQuery } from '@apollo/client';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import { Notification, PaginatedResultInfo } from '@generated/types';
import { CollectModuleFields } from '@gql/CollectModuleFields';
import { MetadataFields } from '@gql/MetadataFields';
import { ProfileFields } from '@gql/ProfileFields';
import { MailIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { FC, useState } from 'react';
import { useInView } from 'react-cool-inview';
import { useAppStore } from 'src/store/app';
import { PAGINATION } from 'src/tracking';

import NotificationShimmer from './Shimmer';
import CollectNotification from './Type/CollectNotification';
import CommentNotification from './Type/CommentNotification';
import FollowerNotification from './Type/FollowerNotification';
import MentionNotification from './Type/MentionNotification';
import MirrorNotification from './Type/MirrorNotification';

const NOTIFICATIONS_QUERY = gql`
  query Notifications($request: NotificationRequest!) {
    notifications(request: $request) {
      items {
        ... on NewFollowerNotification {
          notificationId
          wallet {
            address
            defaultProfile {
              ...ProfileFields
            }
          }
          createdAt
        }
        ... on NewMentionNotification {
          notificationId
          mentionPublication {
            ... on Post {
              id
              profile {
                ...ProfileFields
              }
              metadata {
                content
              }
            }
            ... on Comment {
              id
              profile {
                ...ProfileFields
              }
              metadata {
                content
              }
            }
          }
          createdAt
        }
        ... on NewCommentNotification {
          notificationId
          profile {
            ...ProfileFields
          }
          comment {
            id
            metadata {
              content
            }
            commentOn {
              ... on Post {
                id
              }
              ... on Comment {
                id
              }
              ... on Mirror {
                id
              }
            }
          }
          createdAt
        }
        ... on NewMirrorNotification {
          notificationId
          profile {
            ...ProfileFields
          }
          publication {
            ... on Post {
              id
              metadata {
                name
                content
                attributes {
                  value
                }
              }
            }
            ... on Comment {
              id
              metadata {
                name
                content
                attributes {
                  value
                }
              }
            }
          }
          createdAt
        }
        ... on NewCollectNotification {
          notificationId
          wallet {
            address
            defaultProfile {
              ...ProfileFields
            }
          }
          collectedPublication {
            ... on Post {
              id
              metadata {
                ...MetadataFields
              }
              collectModule {
                ...CollectModuleFields
              }
            }
            ... on Comment {
              id
              metadata {
                ...MetadataFields
              }
              collectModule {
                ...CollectModuleFields
              }
            }
          }
          createdAt
        }
      }
      pageInfo {
        next
      }
    }
  }
  ${ProfileFields}
  ${CollectModuleFields}
  ${MetadataFields}
`;

const List: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>();
  const { data, loading, error, fetchMore } = useQuery(NOTIFICATIONS_QUERY, {
    variables: {
      request: { profileId: currentProfile?.id, limit: 10 }
    },
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setPageInfo(data?.notifications?.pageInfo);
      setNotifications(data?.notifications?.items);
    }
  });

  const { observe } = useInView({
    onEnter: async () => {
      const { data } = await fetchMore({
        variables: {
          request: {
            profileId: currentProfile?.id,
            cursor: pageInfo?.next,
            limit: 10
          }
        }
      });
      setPageInfo(data?.notifications?.pageInfo);
      setNotifications([...notifications, ...data?.notifications?.items]);
      Mixpanel.track(PAGINATION.NOTIFICATION_FEED, { pageInfo });
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
    return <ErrorMessage className="m-3" title="Failed to load notifications" error={error} />;
  }

  if (data?.notifications?.items?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <span>Inbox zero!</span>
          </div>
        }
        icon={<MailIcon className="w-8 h-8 text-brand" />}
        hideCard
      />
    );
  }

  return (
    <Card className="divide-y dark:divide-gray-700">
      {notifications?.map((notification: Notification) => (
        <div key={notification?.notificationId} className="p-5">
          {notification?.__typename === 'NewFollowerNotification' && (
            <FollowerNotification notification={notification as any} />
          )}
          {notification?.__typename === 'NewMentionNotification' && (
            <MentionNotification notification={notification as any} />
          )}
          {notification?.__typename === 'NewCommentNotification' && (
            <CommentNotification notification={notification} />
          )}
          {notification?.__typename === 'NewMirrorNotification' && (
            <MirrorNotification notification={notification} />
          )}
          {notification?.__typename === 'NewCollectNotification' && (
            <CollectNotification notification={notification as any} />
          )}
        </div>
      ))}
      {pageInfo?.next && (
        <span ref={observe} className="flex justify-center p-5">
          <Spinner size="sm" />
        </span>
      )}
    </Card>
  );
};

export default List;
