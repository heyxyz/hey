import { NewCollectNotification } from '@generated/types'
import { CollectionIcon } from '@heroicons/react/outline'
import { formatUsername } from '@lib/formatUsername'
import { getAvatar } from '@lib/getAvatar'
import { imagekitURL } from '@lib/imagekitURL'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React from 'react'

dayjs.extend(relativeTime)

interface Props {
  notification: NewCollectNotification
}

const CollectNotification: React.FC<Props> = ({ notification }) => {
  const { wallet } = notification

  return (
    <>
      <div className="flex justify-between items-center">
        <Link href={`/posts/${notification?.collectedPublication?.id}`}>
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
                <div className="flex space-x-2 items-center">
                  <div>
                    <span className="font-bold">
                      {wallet?.defaultProfile?.name ??
                        wallet?.defaultProfile?.handle ??
                        formatUsername(wallet.address)}{' '}
                    </span>
                    <span className="pl-0.5 text-gray-600">
                      collected your{' '}
                    </span>
                    <Link
                      href={`/posts/${notification?.collectedPublication.id}`}
                    >
                      <a className="font-bold">
                        {notification?.collectedPublication?.__typename?.toLowerCase()}
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="text-sm line-clamp-1 text-gray-500">
                  {notification?.collectedPublication?.metadata?.content}
                </div>
                <div className="text-sm text-gray-400 flex items-center space-x-1">
                  <CollectionIcon className="h-[15px] text-pink-500" />
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
