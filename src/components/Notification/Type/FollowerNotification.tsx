import AppContext from '@components/utils/AppContext'
import { LensterNotification } from '@generated/lenstertypes'
import { NewFollowerNotification } from '@generated/types'
import { UserAddIcon } from '@heroicons/react/outline'
import { HeartIcon } from '@heroicons/react/solid'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React, { FC, useContext } from 'react'

import { NotificationProfileAvatar, NotificationProfileName } from '../Profile'
import {
  NotificationWalletProfileAvatar,
  NotificationWalletProfileName
} from '../WalletProfile'

dayjs.extend(relativeTime)

interface Props {
  notification: NewFollowerNotification & LensterNotification
}

const FollowerNotification: FC<Props> = ({ notification }) => {
  const { currentUser } = useContext(AppContext)

  return (
    <div className="flex items-center space-x-3">
      {notification?.wallet?.defaultProfile ? (
        <NotificationProfileAvatar
          profile={notification?.wallet?.defaultProfile}
        />
      ) : (
        <NotificationWalletProfileAvatar wallet={notification?.wallet} />
      )}
      <div className="w-4/5">
        {notification?.wallet?.defaultProfile ? (
          <NotificationProfileName
            profile={notification?.wallet?.defaultProfile}
          />
        ) : (
          <NotificationWalletProfileName wallet={notification?.wallet} />
        )}{' '}
        <span className="text-gray-600 dark:text-gray-400">
          {currentUser?.followModule ? 'super' : ''} followed you
        </span>
        <div className="flex items-center pt-1 space-x-1 text-gray-400 text-[12px]">
          <UserAddIcon className="text-green-500 h-[15px]" />
          {currentUser?.followModule && (
            <HeartIcon className="text-pink-500 h-[15px]" />
          )}
          <div>{dayjs(new Date(notification?.createdAt)).fromNow()}</div>
        </div>
      </div>
    </div>
  )
}

export default FollowerNotification
