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
      <NotificationProfileAvatar notification={notification} />
      <div className="w-4/5">
        <NotificationProfileName notification={notification} />{' '}
        <span className="text-gray-600 dark:text-gray-400">
          commented on your{' '}
        </span>
        <Link href={`/posts/${notification?.comment?.commentOn?.id}`}>
          <a
            href={`/posts/${notification?.comment?.commentOn?.id}`}
            className="font-bold"
          >
            {notification?.comment?.commentOn?.__typename?.toLowerCase()}
          </a>
        </Link>
        <Link href={`/posts/${notification?.comment.id}`}>
          <a
            href={`/posts/${notification?.comment.id}`}
            className="text-sm text-gray-500 line-clamp-1"
          >
            {notification?.comment?.metadata?.content}
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
