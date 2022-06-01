import Markup from '@components/Shared/Markup'
import { NewCommentNotification } from '@generated/types'
import { ChatAlt2Icon } from '@heroicons/react/outline'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { FC } from 'react'

import { NotificationProfileAvatar, NotificationProfileName } from '../Profile'

dayjs.extend(relativeTime)

interface Props {
  notification: NewCommentNotification
}

const CommentNotification: FC<Props> = ({ notification }) => {
  return (
    <div className="flex items-center space-x-3">
      <NotificationProfileAvatar profile={notification?.profile} />
      <div className="w-4/5">
        <NotificationProfileName profile={notification?.profile} />{' '}
        <span className="text-gray-600 dark:text-gray-400">
          commented on your{' '}
        </span>
        <Link
          href={`/posts/${notification?.comment?.commentOn?.id}`}
          prefetch={false}
        >
          <a
            href={`/posts/${notification?.comment?.commentOn?.id}`}
            className="font-bold"
          >
            {notification?.comment?.commentOn?.__typename?.toLowerCase()}
          </a>
        </Link>
        <Link href={`/posts/${notification?.comment.id}`} prefetch={false}>
          <a
            href={`/posts/${notification?.comment.id}`}
            className="text-sm text-gray-500 line-clamp-1 linkify"
          >
            <Markup>{notification?.comment?.metadata?.content}</Markup>
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

export default CommentNotification
