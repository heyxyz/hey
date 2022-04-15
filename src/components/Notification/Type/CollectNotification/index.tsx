import {
  NotificationProfileAvatar,
  NotificationProfileName
} from '@components/Notification/Profile'
import { NewCollectNotification } from '@generated/types'
import { CashIcon, CollectionIcon, UsersIcon } from '@heroicons/react/outline'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { FC } from 'react'

import CollectedAmount from './Amount'
import CollectedContent from './Content'

dayjs.extend(relativeTime)

interface Props {
  notification: NewCollectNotification
}

const CollectNotification: FC<Props> = ({ notification }) => {
  const postType =
    notification?.collectedPublication?.metadata?.attributes[0]?.value ??
    notification?.collectedPublication?.__typename?.toLowerCase()

  return (
    <div className="flex gap-x-3 items-center">
      <NotificationProfileAvatar notification={notification} />
      <div className="w-4/5">
        <NotificationProfileName notification={notification} />{' '}
        <span className="text-gray-600">
          {postType === 'community'
            ? 'joined your'
            : postType === 'crowdfund'
            ? 'funded your'
            : 'collected your'}{' '}
        </span>
        <Link
          href={
            postType === 'community'
              ? `/communities/${notification?.collectedPublication?.id}`
              : `/posts/${notification?.collectedPublication?.id}`
          }
        >
          <a
            href={
              postType === 'community'
                ? `/communities/${notification?.collectedPublication?.id}`
                : `/posts/${notification?.collectedPublication?.id}`
            }
            className="font-bold"
          >
            {postType}
          </a>
        </Link>
        <CollectedContent notification={notification} />
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
          <div>{dayjs(new Date(notification?.createdAt)).fromNow()}</div>
        </div>
      </div>
    </div>
  )
}

export default CollectNotification
