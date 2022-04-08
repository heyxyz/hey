import { NewMirrorNotification } from '@generated/types'
import { DuplicateIcon } from '@heroicons/react/outline'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React from 'react'

import { NotificationProfileAvatar, NotificationProfileName } from '../Profile'

dayjs.extend(relativeTime)

interface Props {
  notification: NewMirrorNotification
}

const MirrorNotification: React.FC<Props> = ({ notification }) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <Link href={`/posts/${notification?.publication?.id}`}>
          <a>
            <div className="flex items-center space-x-3">
              <NotificationProfileAvatar notification={notification} />
              <div>
                <div className="flex items-center space-x-2">
                  <div>
                    <NotificationProfileName notification={notification} />{' '}
                    <span className="pl-0.5 text-gray-600">mirrored your </span>
                    <Link href={`/posts/${notification?.publication.id}`}>
                      <a className="font-bold">
                        {notification?.publication?.__typename?.toLowerCase()}
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="text-sm text-gray-500 line-clamp-1">
                  {notification?.publication?.metadata?.content}
                </div>
                <div className="flex items-center pt-1 space-x-1 text-gray-400 text-[12px]">
                  <DuplicateIcon className="h-[15px] text-brand-500" />
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

export default MirrorNotification
