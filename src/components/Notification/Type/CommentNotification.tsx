import { NewCommentNotification } from '@generated/types'
import { ChatAlt2Icon } from '@heroicons/react/outline'
import { getAvatar } from '@lib/getAvatar'
import { imagekitURL } from '@lib/imagekitURL'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React from 'react'

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
              <img
                src={
                  notification?.profile?.picture
                    ? getAvatar(notification?.profile)
                    : imagekitURL(
                        `https://avatar.tobi.sh/${notification?.profile?.ownedBy}.svg`,
                        500,
                        500
                      )
                }
                className="w-10 h-10 bg-gray-200 rounded-full border dark:border-gray-700"
                alt={notification?.profile?.handle}
              />
              <div>
                <div className="flex items-center space-x-2">
                  <div>
                    <span className="font-bold">
                      {notification?.profile?.name ??
                        notification?.profile?.handle}{' '}
                    </span>
                    <span className="pl-0.5 text-gray-600">
                      commented on your{' '}
                    </span>
                    <Link href={`/posts/${notification?.comment.id}`}>
                      <a className="font-bold">
                        {notification?.comment?.commentOn?.__typename?.toLowerCase()}
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="text-sm text-gray-500 line-clamp-1">
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
