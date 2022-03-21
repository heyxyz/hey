import { gql, useQuery } from '@apollo/client'
import AppContext from '@components/utils/AppContext'
import { LightningBoltIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useContext, useEffect } from 'react'

const NOTIFICATION_COUNT_QUERY = gql`
  query NotificationCount($request: NotificationRequest!) {
    notifications(request: $request) {
      pageInfo {
        totalCount
      }
    }
  }
`

const Notification: React.FC = () => {
  const { currentUser } = useContext(AppContext)
  const { data } = useQuery(NOTIFICATION_COUNT_QUERY, {
    pollInterval: 5000,
    variables: { request: { profileId: currentUser?.id } },
    skip: !currentUser?.id
  })

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        'notificationCount',
        data?.notifications?.pageInfo?.totalCount.toString()
      )
    }
  }, [currentUser, data])

  return (
    <Link href="/notifications">
      <a className="flex items-start">
        <LightningBoltIcon className="w-6 h-6" />
        <div className="w-2 h-2 bg-red-500 rounded-full" />
      </a>
    </Link>
  )
}

export default Notification
