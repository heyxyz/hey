import { NewMirrorNotification } from '@generated/types'
import { DuplicateIcon } from '@heroicons/react/outline'
import { getAvatar } from '@lib/getAvatar'
import { imagekitURL } from '@lib/imagekitURL'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React from 'react'

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
                <div className="flex space-x-2 items-center">
                  <div>
                    <span className="font-bold">
                      {notification?.profile?.name ??
                        notification?.profile?.handle}{' '}
                    </span>
                    <span className="pl-0.5 text-gray-600">mirrored your </span>
                    <Link href={`/posts/${notification?.publication.id}`}>
                      <a className="font-bold">
                        {notification?.publication?.__typename?.toLowerCase()}
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="text-sm line-clamp-1 text-gray-500">
                  {notification?.publication?.metadata?.content}
                </div>
                <div className="text-[12px] pt-1 text-gray-400 flex items-center space-x-1">
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
