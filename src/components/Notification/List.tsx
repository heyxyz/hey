import { gql, useQuery } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { Notification, PaginatedResultInfo } from '@generated/types'
import { MailIcon } from '@heroicons/react/outline'
import { useContext, useEffect, useState } from 'react'

import NotificationShimmer from './Shimmer'
import CollectNotification from './Type/CollectNotification'
import CommentNotification from './Type/CommentNotification'
import FollowerNotification from './Type/FollowerNotification'
import MirrorNotification from './Type/MirrorNotification'

const NOTIFICATIONS_QUERY = gql`
  query Notifications($request: NotificationRequest!) {
    notifications(request: $request) {
      items {
        ... on NewFollowerNotification {
          wallet {
            address
            defaultProfile {
              id
              name
              handle
              ownedBy
              picture {
                ... on MediaSet {
                  original {
                    url
                  }
                }
              }
            }
          }
          createdAt
        }
        ... on NewCommentNotification {
          profile {
            id
            name
            handle
            ownedBy
            picture {
              ... on MediaSet {
                original {
                  url
                }
              }
            }
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
              __typename
            }
          }
          createdAt
        }
        ... on NewMirrorNotification {
          profile {
            id
            name
            handle
            ownedBy
            picture {
              ... on MediaSet {
                original {
                  url
                }
              }
            }
          }
          publication {
            ... on Post {
              id
              metadata {
                content
              }
            }
            ... on Comment {
              id
              metadata {
                content
              }
            }
          }
          createdAt
        }
        ... on NewCollectNotification {
          wallet {
            address
            defaultProfile {
              id
              name
              handle
              ownedBy
              picture {
                ... on MediaSet {
                  original {
                    url
                  }
                }
              }
            }
          }
          collectedPublication {
            ... on Post {
              id
              metadata {
                content
                attributes {
                  value
                }
              }
            }
            ... on Comment {
              metadata {
                content
                attributes {
                  value
                }
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
`

const List: React.FC = () => {
  const { currentUser } = useContext(AppContext)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const { data, loading, error, fetchMore, refetch } = useQuery(
    NOTIFICATIONS_QUERY,
    {
      variables: {
        request: { profileId: currentUser?.id, limit: 10 }
      },
      onCompleted(data) {
        setPageInfo(data?.notifications?.pageInfo)
        setNotifications(data?.notifications?.items)
      }
    }
  )

  useEffect(() => {
    refetch()
  }, [refetch])

  if (loading)
    return (
      <div className="divide-y">
        <NotificationShimmer />
        <NotificationShimmer />
        <NotificationShimmer />
        <NotificationShimmer />
      </div>
    )

  if (error)
    return (
      <ErrorMessage
        className="m-3"
        title="Failed to load notifications"
        error={error}
      />
    )

  if (data?.notifications?.items?.length === 0)
    return (
      <EmptyState
        message={
          <div>
            <span>Inbox zero!</span>
          </div>
        }
        icon={<MailIcon className="w-8 h-8 text-brand-500" />}
        hideCard
      />
    )

  return (
    <div className="divide-y">
      {notifications?.map((notification: Notification, index: number) => (
        <div key={index}>
          {notification.__typename === 'NewFollowerNotification' && (
            <div className="p-4">
              <FollowerNotification notification={notification} />
            </div>
          )}
          {notification.__typename === 'NewCommentNotification' && (
            <div className="p-4">
              <CommentNotification notification={notification} />
            </div>
          )}
          {notification.__typename === 'NewMirrorNotification' && (
            <div className="p-4">
              <MirrorNotification notification={notification} />
            </div>
          )}
          {notification.__typename === 'NewCollectNotification' && (
            <div className="p-4">
              <CollectNotification notification={notification} />
            </div>
          )}
        </div>
      ))}
      {pageInfo?.next && (
        <span className="flex justify-center p-5 text-sm">
          <Button
            variant="secondary"
            outline
            disabled={isLoadingMore}
            icon={isLoadingMore && <Spinner size="xs" variant="secondary" />}
            onClick={() => {
              setIsLoadingMore(true)
              fetchMore({
                variables: {
                  request: {
                    profileId: currentUser?.id,
                    cursor: pageInfo?.next,
                    limit: 10
                  }
                }
              })
                .then(({ data }: any) => {
                  setPageInfo(data?.notifications?.pageInfo)
                  setNotifications([
                    ...notifications,
                    ...data?.notifications?.items
                  ])
                })
                .finally(() => setIsLoadingMore(false))
            }}
          >
            {isLoadingMore ? 'Loading...' : 'Show more'}
          </Button>
        </span>
      )}
    </div>
  )
}

export default List
