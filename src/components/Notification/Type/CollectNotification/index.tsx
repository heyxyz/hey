import NotificationProfile from '@components/Notification/Profile'
import { NewCollectNotification } from '@generated/types'
import { CashIcon, CollectionIcon, UsersIcon } from '@heroicons/react/outline'
import { formatUsername } from '@lib/formatUsername'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React from 'react'

import CollectedAmount from './Amount'

dayjs.extend(relativeTime)

interface Props {
  notification: NewCollectNotification
}

const CollectNotification: React.FC<Props> = ({ notification }) => {
  const { wallet } = notification
  const postType =
    notification?.collectedPublication?.metadata?.attributes[0]?.value ??
    notification?.collectedPublication?.__typename?.toLowerCase()

  return (
    <>
      <div className="flex justify-between items-center">
        <Link href={`/posts/${notification?.collectedPublication?.id}`}>
          <a>
            <div className="flex items-center space-x-3">
              <NotificationProfile notification={notification} />
              <div>
                <div className="flex items-center space-x-2">
                  <div>
                    <span className="font-bold">
                      {wallet?.defaultProfile?.name ??
                        wallet?.defaultProfile?.handle ??
                        formatUsername(wallet.address)}{' '}
                    </span>
                    <span className="pl-0.5 text-gray-600">
                      {postType === 'community'
                        ? 'joined your'
                        : postType === 'crowdfund'
                        ? 'funded your'
                        : 'collected your'}{' '}
                    </span>
                    <Link
                      href={
                        postType === 'community'
                          ? `/communities/${notification?.collectedPublication.id}`
                          : `/posts/${notification?.collectedPublication.id}`
                      }
                    >
                      <a className="font-bold">{postType}</a>
                    </Link>
                  </div>
                </div>
                <div className="text-sm text-gray-500 line-clamp-1">
                  {notification?.collectedPublication?.metadata?.content}
                </div>
                {postType !== 'community' && (
                  <CollectedAmount notification={notification} />
                )}
                <div className="flex items-center pt-1 space-x-1 text-gray-400 text-[12px]">
                  {postType === 'community' ? (
                    <UsersIcon className="text-pink-500 h-[15px]" />
                  ) : postType === 'crowdfund' ? (
                    <CashIcon className="text-pink-500 h-[15px]" />
                  ) : (
                    <CollectionIcon className="text-pink-500 h-[15px]" />
                  )}
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

export default CollectNotification
