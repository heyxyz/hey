import { gql, useQuery } from '@apollo/client'
import AppContext from '@components/utils/AppContext'
import { LightningBoltIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'

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
  const [showBadge, setShowBadge] = useState<boolean>(false)
  const { currentUser } = useContext(AppContext)
  const { data } = useQuery(NOTIFICATION_COUNT_QUERY, {
    pollInterval: 5000,
    variables: { request: { profileId: currentUser?.id } },
    skip: !currentUser?.id
  })

  useEffect(() => {
    if (currentUser && data) {
      const localCount = localStorage.getItem('notificationCount') ?? '0'
      const currentCount = data?.notifications?.pageInfo?.totalCount.toString()
      console.log(localCount, currentCount)
      setShowBadge(localCount !== currentCount)
    }
  }, [currentUser, data])

  return (
    <Link href="/notifications">
      <a className="flex items-start">
        <LightningBoltIcon className="w-6 h-6" />
        {showBadge && <div className="w-2 h-2 bg-red-500 rounded-full" />}
      </a>
    </Link>
  )
}

export default Notification
