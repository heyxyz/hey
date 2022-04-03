import { gql, useQuery } from '@apollo/client'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { Notification } from '@generated/types'
import { useContext } from 'react'
import useInView from 'react-cool-inview'

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
        totalCount
        next
      }
    }
  }
`

const List: React.FC = () => {
  const { currentUser } = useContext(AppContext)
  const { data, loading, error, fetchMore } = useQuery(NOTIFICATIONS_QUERY, {
    variables: {
      request: { profileId: currentUser?.id, limit: 10 }
    }
  })

  const pageInfo = data?.notifications?.pageInfo
  const { observe } = useInView({
    threshold: 1,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            profileId: currentUser?.id,
            cursor: pageInfo?.next,
            limit: 10
          }
        }
      })
    }
  })

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

  const notifications = data?.notifications?.items

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
        <span ref={observe} className="flex justify-center p-5">
          <Spinner size="sm" />
        </span>
      )}
    </div>
  )
}

export default List
