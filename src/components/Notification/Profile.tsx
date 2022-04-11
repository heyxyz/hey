import { Notification } from '@generated/types'
import formatAddress from '@lib/formatAddress'
import getAvatar from '@lib/getAvatar'
import imagekitURL from '@lib/imagekitURL'
import Link from 'next/link'
import React, { FC } from 'react'
import { POLYGONSCAN_URL } from 'src/constants'

interface Props {
  notification: Notification
}

export const NotificationProfileAvatar: FC<Props> = ({ notification }) => {
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

  const profile = wallet
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
    <Link href={profile.url}>
      <a target={profile.target}>
        <img
          src={picture}
          className="w-10 h-10 bg-gray-200 border rounded-full dark:border-gray-800"
          alt={profile.alt}
        />
      </a>
    </Link>
  )
}

export const NotificationProfileName: FC<Props> = ({ notification }) => {
  const { wallet }: any = notification
  const profile = wallet
    ? wallet?.defaultProfile
      ? {
          name: wallet?.defaultProfile?.name ?? wallet?.defaultProfile?.handle,
          url: `/u/${wallet?.defaultProfile?.handle}`,
          target: '_self'
        }
      : {
          name: formatAddress(wallet?.address),
          url: `${POLYGONSCAN_URL}/address/${wallet?.address}`,
          target: '_blank'
        }
    : {
        // @ts-ignore
        name: notification?.profile?.name ?? notification?.profile?.handle,
        // @ts-ignore
        url: `/u/${notification?.profile?.handle}`,
        target: '_self'
      }

  return (
    <Link href={profile.url}>
      <a className="font-bold" target={profile.target}>
        {profile.name}
      </a>
    </Link>
  )
}
