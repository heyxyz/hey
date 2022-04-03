import { gql, useQuery } from '@apollo/client'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { Notification } from '@generated/types'
import { CommentFragment } from '@gql/CommentFragment'
import { PostFragment } from '@gql/PostFragment'
import { Menu } from '@headlessui/react'
import { useContext } from 'react'
import useInView from 'react-cool-inview'

import CommentNotification from './Type/CommentNotification'
import FollowerNotification from './Type/FollowerNotification'

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
            handle
          }
          publication {
            ... on Post {
              ...PostFragment
            }
            ... on Comment {
              ...CommentFragment
            }
          }
        }
        ... on NewCollectNotification {
          wallet {
            address
            defaultProfile {
              handle
            }
          }
          collectedPublication {
            ... on Post {
              ...PostFragment
            }
            ... on Comment {
              ...CommentFragment
            }
          }
        }
      }
      pageInfo {
        totalCount
        next
      }
    }
  }
  ${PostFragment}
  ${CommentFragment}
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

  if (loading) return <div className="h-5 rounded-lg shimmer m-3" />
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
            <Menu.Item as="div" className="p-4">
              <FollowerNotification notification={notification} />
            </Menu.Item>
          )}
          {notification.__typename === 'NewCommentNotification' && (
            <Menu.Item as="div" className="p-4">
              <CommentNotification notification={notification} />
            </Menu.Item>
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
