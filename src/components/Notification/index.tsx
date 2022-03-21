import { gql, useQuery } from '@apollo/client'
import { Card, CardBody } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { PageLoading } from '@components/UI/PageLoading'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { Notification } from '@generated/types'
import { BellIcon } from '@heroicons/react/outline'
import { NextPage } from 'next'
import React, { useContext } from 'react'
import useInView from 'react-cool-inview'
import Custom404 from 'src/pages/404'

const NOTIFICATIONS_QUERY = gql`
  query Notifications($request: NotificationRequest!) {
    notifications(request: $request) {
      items {
        ... on NewFollowerNotification {
          wallet {
            address
            defaultProfile {
              handle
            }
          }
          isFollowedByMe
          createdAt
        }
      }
      pageInfo {
        next
      }
    }
  }
`

const NotificationWrapper = ({ children }: { children: React.ReactChild }) => (
  <div className="flex justify-center flex-grow px-0 py-8 sm:px-6 lg:px-8">
    <div className="w-full max-w-4xl space-y-3">{children}</div>
  </div>
)

const Notification: NextPage = () => {
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

  if (!currentUser) return <Custom404 />
  if (loading) return <PageLoading message="Loading notifications" />
  if (data?.notifications?.items?.length === 0)
    return (
      <NotificationWrapper>
        <EmptyState
          message={
            <div>
              <span>Inbox zero!</span>
            </div>
          }
          icon={<BellIcon className="w-8 h-8 text-brand-500" />}
        />
      </NotificationWrapper>
    )

  const notifications = data?.notifications?.items

  return (
    <NotificationWrapper>
      <Card className="mx-auto">
        <CardBody>
          {error && (
            <ErrorMessage title="Failed to load notification" error={error} />
          )}
          {notifications.map((notification: Notification, index: number) => (
            <div key={index} className="py-5">
              {JSON.stringify(notification)}
            </div>
          ))}
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-5">
              <Spinner size="sm" />
            </span>
          )}
        </CardBody>
      </Card>
    </NotificationWrapper>
  )
}

export default Notification
