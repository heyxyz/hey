import {
  NewCollectNotification,
  NewCommentNotification,
  NewFollowerNotification,
  NewMirrorNotification
} from '@generated/types'
import { getAvatar } from '@lib/getAvatar'
import { imagekitURL } from '@lib/imagekitURL'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React from 'react'

dayjs.extend(relativeTime)

interface Props {
  notification:
    | NewCollectNotification
    | NewCommentNotification
    | NewFollowerNotification
    | NewMirrorNotification
}

const NotificationProfile: React.FC<Props> = ({ notification }) => {
  const { wallet }: any = notification
  const picture = wallet
    ? wallet?.defaultProfile?.picture
      ? getAvatar(wallet?.defaultProfile)
      : imagekitURL(`https://avatar.tobi.sh/${wallet?.address}.png`, 500, 500)
    : // @ts-ignore
    notification?.profile?.picture
    ? // @ts-ignore
      getAvatar(notification?.profile)
    : imagekitURL(
        // @ts-ignore
        `https://avatar.tobi.sh/${notification?.profile?.ownedBy}.png`,
        500,
        500
      )
  const alt = wallet
    ? wallet?.defaultProfile
      ? wallet?.defaultProfile?.handle
      : wallet?.address
    : // @ts-ignore
      notification?.profile?.handle
  return (
    <img
      src={picture}
      className="w-10 h-10 bg-gray-200 rounded-full border dark:border-gray-700"
      alt={alt}
    />
  )
}

export default NotificationProfile
