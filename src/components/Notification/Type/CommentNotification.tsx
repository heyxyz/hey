import { NewCommentNotification } from '@generated/types'
import { ChatAlt2Icon } from '@heroicons/react/outline'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React from 'react'

import { NotificationProfileAvatar, NotificationProfileName } from '../Profile'

dayjs.extend(relativeTime)

interface Props {
  notification: NewCommentNotification
}

const CommentNotification: React.FC<Props> = ({ notification }) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <Link href={`/posts/${notification?.comment.id}`}>
          <a>
            <div className="flex items-center space-x-3">
              <NotificationProfileAvatar notification={notification} />
              <div>
                <div className="flex items-center space-x-2">
                  <div>
                    <NotificationProfileName notification={notification} />{' '}
                    <span className="pl-0.5 text-gray-600">
                      commented on your{' '}
                    </span>
                    <Link
                      href={`/posts/${notification?.comment?.commentOn?.id}`}
                    >
                      <a className="font-bold">
                        {notification?.comment?.commentOn?.__typename?.toLowerCase()}
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="w-72 text-sm text-gray-500 line-clamp-1">
                  {notification?.comment?.metadata?.content}
                </div>
                <div className="flex items-center pt-1 space-x-1 text-gray-400 text-[12px]">
                  <ChatAlt2Icon className="text-blue-500 h-[15px]" />
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

export default CommentNotification
