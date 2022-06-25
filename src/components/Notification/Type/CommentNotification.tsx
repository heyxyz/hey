import Markup from '@components/Shared/Markup'
import { NewCommentNotification } from '@generated/types'
import { ChatAlt2Icon } from '@heroicons/react/solid'
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
    <div className="flex justify-between items-start">
      <div className="space-y-2 w-4/5">
        <div className="flex items-center space-x-2">
          <ChatAlt2Icon className="h-6 w-6 text-blue-500" />
          <NotificationProfileAvatar profile={notification?.profile} />
        </div>
        <div className="ml-8">
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
              className="text-gray-500 line-clamp-2 linkify mt-2"
            >
              <Markup>{notification?.comment?.metadata?.content}</Markup>
            </a>
          </Link>
        </div>
      </div>
      <div className="text-gray-400 text-[12px]">
        <div>{dayjs(new Date(notification?.createdAt)).fromNow()}</div>
      </div>
    </div>
  )
}

export default CommentNotification
