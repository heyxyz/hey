import { NewFollowerNotification } from '@generated/types'
import { UserAddIcon } from '@heroicons/react/outline'
import { formatUsername } from '@lib/formatUsername'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React from 'react'
import { POLYGONSCAN_URL } from 'src/constants'

import NotificationProfile from '../Profile'

dayjs.extend(relativeTime)

interface Props {
  notification: NewFollowerNotification
}

const FollowerNotification: React.FC<Props> = ({ notification }) => {
  const { wallet } = notification

  return (
    <>
      <div className="flex justify-between items-center">
        <Link
          href={
            wallet?.defaultProfile
              ? `/u/${wallet?.defaultProfile?.handle}`
              : `${POLYGONSCAN_URL}/address/${wallet?.address}`
          }
        >
          <a
            target={wallet.defaultProfile ? '_self' : '_blank'}
            rel="noreferrer"
          >
            <div className="flex items-center space-x-3">
              <NotificationProfile notification={notification} />
              <div>
                <span className="font-bold">
                  {wallet?.defaultProfile?.name ??
                    wallet?.defaultProfile?.handle ??
                    formatUsername(wallet.address)}{' '}
                </span>
                <span className="pl-0.5 text-gray-600">followed you</span>
                <div className="flex items-center pt-1 space-x-1 text-gray-400 text-[12px]">
                  <UserAddIcon className="text-green-500 h-[15px]" />
                  <div>{dayjs(new Date(notification.createdAt)).fromNow()}</div>
                </div>
              </div>
            </div>
          </a>
        </Link>
      </div>
    </>
  )
}

export default FollowerNotification
