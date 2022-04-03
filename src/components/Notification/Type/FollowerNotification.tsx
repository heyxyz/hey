import { NewFollowerNotification } from '@generated/types'
import { UserAddIcon } from '@heroicons/react/outline'
import { formatUsername } from '@lib/formatUsername'
import { getAvatar } from '@lib/getAvatar'
import { imagekitURL } from '@lib/imagekitURL'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React from 'react'

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
              : `https://mumbai.polygonscan.com/address/${wallet?.address}`
          }
        >
          <a>
            <div className="flex items-center space-x-3">
              <img
                src={
                  wallet?.defaultProfile?.picture
                    ? getAvatar(wallet?.defaultProfile)
                    : imagekitURL(
                        `https://avatar.tobi.sh/${wallet?.address}.svg`,
                        500,
                        500
                      )
                }
                className="w-10 h-10 bg-gray-200 rounded-full border dark:border-gray-700"
                alt={
                  wallet?.defaultProfile
                    ? wallet?.defaultProfile?.handle
                    : wallet?.address
                }
              />
              <div>
                <span className="font-bold">
                  {wallet?.defaultProfile?.name ??
                    wallet?.defaultProfile?.handle ??
                    formatUsername(wallet.address)}{' '}
                </span>
                <span className="pl-0.5 text-gray-600">followed you</span>
                <div className="text-sm text-gray-400 flex items-center space-x-1">
                  <UserAddIcon className="h-[15px] text-green-500" />
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
