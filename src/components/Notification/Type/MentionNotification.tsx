import Markup from '@components/Shared/Markup'
import { NewMentionNotification } from '@generated/types'
import { ChatAlt2Icon } from '@heroicons/react/outline'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { FC } from 'react'

import { NotificationProfileAvatar, NotificationProfileName } from '../Profile'

dayjs.extend(relativeTime)

interface Props {
  notification: NewMentionNotification
}

const MentionNotification: FC<Props> = ({ notification }) => {
  const profile = notification?.mentionPublication?.profile

  return (
    <div className="flex items-center space-x-3">
      <NotificationProfileAvatar profile={profile} />
      <div className="w-4/5">
        <NotificationProfileName profile={profile} />{' '}
        <span className="text-gray-600 dark:text-gray-400">
          mentioned you in a{' '}
        </span>
        <Link href={`/posts/${notification?.mentionPublication?.id}`}>
          <a
            href={`/posts/${notification?.mentionPublication?.id}`}
            className="font-bold"
          >
            {notification?.mentionPublication?.__typename?.toLowerCase()}
          </a>
        </Link>
        <Link href={`/posts/${notification?.mentionPublication.id}`}>
          <a
            href={`/posts/${notification?.mentionPublication.id}`}
            className="text-sm text-gray-500 line-clamp-1 linkify"
          >
            <Markup>
              {notification?.mentionPublication?.metadata?.content}
            </Markup>
          </a>
        </Link>
        <div className="flex items-center pt-1 space-x-1 text-gray-400 text-[12px]">
          <ChatAlt2Icon className="text-blue-500 h-[15px]" />
          <div>{dayjs(new Date(notification?.createdAt)).fromNow()}</div>
        </div>
      </div>
    </div>
  )
}

export default MentionNotification
