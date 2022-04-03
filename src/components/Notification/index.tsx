import { gql, useQuery } from '@apollo/client'
import AppContext from '@components/utils/AppContext'
import { Notification } from '@generated/types'
import { CommentFragment } from '@gql/CommentFragment'
import { PostFragment } from '@gql/PostFragment'
import { Menu, Transition } from '@headlessui/react'
import { LightningBoltIcon } from '@heroicons/react/outline'
import { Fragment, useContext } from 'react'

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
          isFollowedByMe
          createdAt
        }
        ... on NewCommentNotification {
          profile {
            handle
          }
          comment {
            ...CommentFragment
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

const Notification: React.FC = () => {
  const { currentUser } = useContext(AppContext)
  const { data, loading, error, fetchMore } = useQuery(NOTIFICATIONS_QUERY, {
    variables: {
      request: { profileId: currentUser?.id, limit: 30 }
    }
  })

  const notifications = data?.notifications?.items

  return (
    <Menu as="span" className="relative mt-1.5">
      {({ open }) => (
        <>
          <Menu.Button>
            <LightningBoltIcon className="h-6 w-6" />
          </Menu.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="overflow-y-auto max-h-[50vh] absolute py-1 right-0 mt-1 w-full md:min-w-[25rem] bg-white rounded-xl border shadow-sm dark:bg-gray-900 dark:border-gray-800">
              <div className="px-1 py-1">
                {notifications?.map(
                  (notification: Notification, index: number) => (
                    <div key={index}>
                      {notification.__typename ===
                        'NewFollowerNotification' && (
                        <Menu.Item as="div" className="px-3 py-2">
                          {notification.__typename}
                        </Menu.Item>
                      )}
                    </div>
                  )
                )}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}

export default Notification
