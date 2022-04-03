import { NewCommentNotification } from '@generated/types'
import { ChatAlt2Icon } from '@heroicons/react/outline'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import { getAvatar } from '@lib/getAvatar'
import { imagekitURL } from '@lib/imagekitURL'
import { isVerified } from '@lib/isVerified'
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
                <div className="flex gap-1 items-center">
                  <ChatAlt2Icon className="h-4 w-4 text-blue-500 mr-1" />
                  <div className="font-bold">
                    {notification?.profile?.name ??
                      notification?.profile?.handle}
                  </div>
                  {isVerified(notification?.profile?.id) && (
                    <BadgeCheckIcon className="w-4 h-4 text-brand-500" />
                  )}
                  <div className="pl-0.5 text-gray-600">commented on your</div>
                  <Link href={`/posts/${notification?.comment.id}`}>
                    <a className="font-bold">
                      {notification?.comment?.commentOn?.__typename?.toLowerCase()}
                    </a>
                  </Link>
                </div>
                <div className="text-sm line-clamp-1 text-gray-500">
                  {notification?.comment?.metadata?.content}
                </div>
                <div className="text-sm text-gray-400">
                  {dayjs(new Date(notification.createdAt)).fromNow()}
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
