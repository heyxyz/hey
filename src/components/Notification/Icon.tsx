import { gql, useQuery } from '@apollo/client'
import { LightningBoltIcon } from '@heroicons/react/outline'
import { Dogstats } from '@lib/dogstats'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { useAppPersistStore } from 'src/store/app'
import { NOTIFICATION } from 'src/tracking'

const NOTIFICATION_COUNT_QUERY = gql`
  query NotificationCount($request: NotificationRequest!) {
    notifications(request: $request) {
      pageInfo {
        totalCount
      }
    }
  }
`

const NotificationIcon: FC = () => {
  const { currentUser } = useAppPersistStore()
  const [showBadge, setShowBadge] = useState<boolean>(false)
  const { data } = useQuery(NOTIFICATION_COUNT_QUERY, {
    variables: { request: { profileId: currentUser?.id } },
    skip: !currentUser?.id
  })

  useEffect(() => {
    if (currentUser && data) {
      const localCount = localStorage.notificationCount ?? '0'
      const currentCount = data?.notifications?.pageInfo?.totalCount.toString()
      setShowBadge(localCount !== currentCount)
    }
  }, [currentUser, data])

  return (
    <Link href="/notifications">
      <a
        className="flex items-start"
        href="/notifications"
        onClick={() => {
          localStorage.setItem(
            'notificationCount',
            data?.notifications?.pageInfo?.totalCount.toString()
          )
          setShowBadge(false)
          Dogstats.track(NOTIFICATION.OPEN)
        }}
      >
        <LightningBoltIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        {showBadge && <div className="w-2 h-2 bg-red-500 rounded-full" />}
      </a>
    </Link>
  )
}

export default NotificationIcon
