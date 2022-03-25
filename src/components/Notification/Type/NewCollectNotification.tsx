import SinglePost from '@components/Post/SinglePost'
import Slug from '@components/Shared/Slug'
import {
  LensterNewCollectNotification,
  LensterPost
} from '@generated/lenstertypes'
import { CollectionIcon } from '@heroicons/react/outline'
import { formatUsername } from '@lib/formatUsername'
import Link from 'next/link'
import React from 'react'

interface Props {
  notification: LensterNewCollectNotification
}

const NewCollectNotification: React.FC<Props> = ({ notification }) => {
  return (
    <div>
      <div className="flex items-center px-5 pt-5 space-x-1 text-sm text-gray-500">
        <CollectionIcon className="w-4 h-4" />
        <div className="flex items-center space-x-1">
          {notification?.wallet?.defaultProfile ? (
            <Link href={`/u/${notification?.wallet?.defaultProfile?.handle}`}>
              <a>
                <Slug
                  slug={notification?.wallet?.defaultProfile?.handle}
                  prefix="@"
                />
              </a>
            </Link>
          ) : (
            <a
              className="flex items-center space-x-3"
              href={`https://mumbai.polygonscan.com/address/${notification?.wallet?.address}`}
              target="_blank"
              rel="noreferrer"
            >
              <Slug slug={formatUsername(notification?.wallet?.address)} />
            </a>
          )}
          <div>collected your</div>
          <Link href={`/posts/${notification?.collectedPublication.pubId}`}>
            <a className="font-bold">
              {notification?.collectedPublication.__typename?.toLowerCase()}
            </a>
          </Link>
        </div>
      </div>
      <SinglePost
        post={notification.collectedPublication as LensterPost}
        showCard={false}
        type="COLLECT"
      />
    </div>
  )
}

export default NewCollectNotification
