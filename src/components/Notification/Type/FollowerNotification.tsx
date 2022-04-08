import { NewFollowerNotification } from '@generated/types'
import { UserAddIcon } from '@heroicons/react/outline'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React from 'react'

import { NotificationProfileAvatar, NotificationProfileName } from '../Profile'

dayjs.extend(relativeTime)

interface Props {
  notification: NewFollowerNotification
}

const FollowerNotification: React.FC<Props> = ({ notification }) => {
  const { wallet } = notification

  return (
    <div className="flex items-center space-x-3">
      <NotificationProfileAvatar notification={notification} />
      <div className="w-4/5">
        <NotificationProfileName notification={notification} />{' '}
        <span className="text-gray-600">followed you</span>
        <div className="flex items-center pt-1 space-x-1 text-gray-400 text-[12px]">
          <UserAddIcon className="text-green-500 h-[15px]" />
          <div>{dayjs(new Date(notification.createdAt)).fromNow()}</div>
        </div>
      </div>
    </div>
  )
}

export default FollowerNotification
