import { gql, useQuery } from '@apollo/client'
import AppContext from '@components/utils/AppContext'
import { LightningBoltIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
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
  const { pathname } = useRouter()
  const [showBadge, setShowBadge] = useState<boolean>(false)
  const { currentUser } = useContext(AppContext)
  const { data } = useQuery(NOTIFICATION_COUNT_QUERY, {
    pollInterval: pathname === '/notifications' ? 0 : 5000,
    variables: { request: { profileId: currentUser?.id } },
    skip: !currentUser?.id
  })

  useEffect(() => {
    if (currentUser && data) {
      const localCount = localStorage.getItem('notificationCount') ?? '0'
      const currentCount = data?.notifications?.pageInfo?.totalCount.toString()
      setShowBadge(localCount !== currentCount)
    }
  }, [currentUser, data])

  return (
    <Link href="/notifications">
      <a
        className="flex items-start"
        onClick={() => {
          localStorage.setItem(
            'notificationCount',
            data?.notifications?.pageInfo?.totalCount.toString()
          )
          setShowBadge(false)
        }}
      >
        <LightningBoltIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        {showBadge && <div className="w-2 h-2 bg-red-500 rounded-full" />}
      </a>
    </Link>
  )
}

export default Notification
