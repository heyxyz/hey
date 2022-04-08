import {
  NewCollectNotification,
  NewCommentNotification,
  NewFollowerNotification,
  NewMirrorNotification
} from '@generated/types'
import { formatUsername } from '@lib/formatUsername'
import { getAvatar } from '@lib/getAvatar'
import { imagekitURL } from '@lib/imagekitURL'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React from 'react'
import { POLYGONSCAN_URL } from 'src/constants'

dayjs.extend(relativeTime)

interface Props {
  notification:
    | NewCollectNotification
    | NewCommentNotification
    | NewFollowerNotification
    | NewMirrorNotification
}

export const NotificationProfileAvatar: React.FC<Props> = ({
  notification
}) => {
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

  const config = wallet
    ? wallet?.defaultProfile
      ? {
          url: `/u/${wallet?.defaultProfile?.handle}`,
          target: '_self',
          alt: wallet?.defaultProfile?.handle
        }
      : {
          url: `${POLYGONSCAN_URL}/address/${wallet?.address}`,
          target: '_blank',
          alt: wallet?.address
        }
    : {
        // @ts-ignore
        url: `/u/${notification?.profile?.handle}`,
        target: '_self',
        // @ts-ignore
        alt: notification?.profile?.handle
      }

  return (
    <Link href={config.url}>
      <a target={config.target}>
        <img
          src={picture}
          className="w-10 h-10 bg-gray-200 rounded-full border dark:border-gray-700"
          alt={config.alt}
        />
      </a>
    </Link>
  )
}

export const NotificationProfileName: React.FC<Props> = ({ notification }) => {
  const { wallet }: any = notification
  const config = wallet
    ? wallet?.defaultProfile
      ? {
          name: wallet?.defaultProfile?.name ?? wallet?.defaultProfile?.handle,
          url: `/u/${wallet?.defaultProfile?.handle}`,
          target: '_self'
        }
      : {
          name: formatUsername(wallet?.address),
          url: `${POLYGONSCAN_URL}/address/${wallet?.address}`,
          target: '_blank'
        }
    : {
        // @ts-ignore
        name: notification?.profile?.name,
        // @ts-ignore
        url: `/u/${notification?.profile?.handle}`,
        target: '_self'
      }

  return (
    <Link href={config.url}>
      <a className="font-bold" target={config.target}>
        {config.name}
      </a>
    </Link>
  )
}
