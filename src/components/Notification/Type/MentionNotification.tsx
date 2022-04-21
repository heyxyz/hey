import { NewMentionNotification } from '@generated/types'
import { ChatAlt2Icon } from '@heroicons/react/outline'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import getAvatar from '@lib/getAvatar'
import isVerified from '@lib/isVerified'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { FC } from 'react'

dayjs.extend(relativeTime)

interface Props {
  notification: NewMentionNotification
}

const MentionNotification: FC<Props> = ({ notification }) => {
  const profile = notification?.mentionPublication?.profile

  return (
    <div className="flex items-center space-x-3">
      <Link href={`/u/${profile?.handle}`}>
        <a href={`/u/${profile?.handle}`}>
          <img
            src={getAvatar(profile)}
            className="w-10 h-10 bg-gray-200 rounded-full border dark:border-gray-700/80"
            alt={profile.handle}
          />
        </a>
      </Link>
      <div className="w-4/5">
        <Link href={`/u/${profile?.handle}`}>
          <a
            href={`/u/${profile?.handle}`}
            className="inline-flex items-center space-x-1 font-bold"
          >
            <div>{profile.name ?? profile?.handle}</div>
            {isVerified(profile?.id) && (
              <BadgeCheckIcon className="w-4 h-4 text-brand" />
            )}
          </a>
        </Link>{' '}
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
            className="text-sm text-gray-500 line-clamp-1"
          >
            {notification?.mentionPublication?.metadata?.content}
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
