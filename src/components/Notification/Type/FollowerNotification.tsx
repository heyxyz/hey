import { NewFollowerNotification } from '@generated/types'
import { UserAddIcon } from '@heroicons/react/outline'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import { formatUsername } from '@lib/formatUsername'
import { getAvatar } from '@lib/getAvatar'
import { imagekitURL } from '@lib/imagekitURL'
import { isVerified } from '@lib/isVerified'
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
                <div className="flex gap-1 items-center">
                  <UserAddIcon className="h-4 w-4 text-green-500 mr-1" />
                  <div className="font-bold">
                    {wallet?.defaultProfile?.name ??
                      wallet?.defaultProfile?.handle ??
                      formatUsername(wallet.address)}
                  </div>
                  {wallet?.defaultProfile &&
                    isVerified(wallet?.defaultProfile?.id) && (
                      <BadgeCheckIcon className="w-4 h-4 text-brand-500" />
                    )}
                  <div className="pl-0.5 text-gray-600">followed you</div>
                </div>
                <div className="text-sm text-gray-400">
                  {dayjs(new Date(notification.createdAt)).fromNow()}
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
