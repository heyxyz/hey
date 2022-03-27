import Follow from '@components/Shared/Follow'
import Unfollow from '@components/Shared/Unfollow'
import { NewFollowerNotification } from '@generated/types'
import { BadgeCheckIcon } from '@heroicons/react/outline'
import { getAvatar } from '@lib/getAvatar'
import { isVerified } from '@lib/isVerified'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { useState } from 'react'

dayjs.extend(relativeTime)

interface Props {
  notification: NewFollowerNotification
}

const FollowerNotification: React.FC<Props> = ({ notification }) => {
  const [following, setFollowing] = useState<boolean>(
    notification.isFollowedByMe
  )
  const { wallet } = notification

  return (
    <div className="p-5">
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
                    : `https://avatar.tobi.sh/${wallet?.address}.svg`
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
                  <div className="font-bold">
                    {wallet?.defaultProfile?.name ??
                      wallet?.defaultProfile?.handle ??
                      wallet.address}
                  </div>
                  {wallet?.defaultProfile &&
                    isVerified(wallet?.defaultProfile?.handle) && (
                      <BadgeCheckIcon className="w-4 h-4 text-brand-500" />
                    )}
                  <div className="pl-0.5 text-gray-600">followed you</div>
                </div>
                <div className="text-sm text-gray-500">
                  {dayjs(new Date(notification.createdAt)).fromNow()}
                </div>
              </div>
            </div>
          </a>
        </Link>
        {wallet?.defaultProfile &&
          (following ? (
            <Unfollow
              profile={wallet?.defaultProfile}
              setFollowing={setFollowing}
              showText
            />
          ) : (
            <Follow
              profile={wallet?.defaultProfile}
              setFollowing={setFollowing}
              showText
            />
          ))}
      </div>
    </div>
  )
}

export default FollowerNotification
