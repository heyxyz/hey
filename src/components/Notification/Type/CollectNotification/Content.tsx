import Markup from '@components/Shared/Markup';
import { NewCollectNotification } from '@generated/types';
import getIPFSLink from '@lib/getIPFSLink';
import imagekitURL from '@lib/imagekitURL';
import Link from 'next/link';
import React, { FC } from 'react';

interface Props {
  notification: NewCollectNotification;
}

const CollectedContent: FC<Props> = ({ notification }) => {
  const publicationType =
    notification?.collectedPublication?.metadata?.attributes[0]?.value ??
    notification?.collectedPublication?.__typename?.toLowerCase();

  return (
    <div className="text-gray-500 line-clamp-2 mt-2">
      {publicationType === 'community' ? (
        <Link href={`/communities/${notification?.collectedPublication?.id}`}>
          <a
            href={`/communities/${notification?.collectedPublication?.id}`}
            className="flex items-center space-x-1.5 font-bold"
          >
            <img
              src={imagekitURL(
                getIPFSLink(
                  notification?.collectedPublication?.metadata?.cover?.original?.url
                    ? notification?.collectedPublication?.metadata?.cover?.original?.url
                    : `https://avatar.tobi.sh/${notification?.collectedPublication?.id}.png`
                ),
                'avatar'
              )}
              className="w-4 h-4 bg-gray-200 rounded ring-2 ring-gray-50 dark:bg-gray-700 dark:ring-black"
              height={16}
              width={16}
              alt={notification?.collectedPublication?.id}
            />
            <div>{notification?.collectedPublication?.metadata?.name}</div>
          </a>
        </Link>
      ) : publicationType === 'crowdfund' ? (
        <Link href={`/posts/${notification?.collectedPublication?.id}`}>
          <a href={`/posts/${notification?.collectedPublication?.id}`}>
            {notification?.collectedPublication?.metadata?.name}
          </a>
        </Link>
      ) : (
        <Link href={`/posts/${notification?.collectedPublication?.id}`}>
          <a className="linkify" href={`/posts/${notification?.collectedPublication?.id}`}>
            <Markup>{notification?.collectedPublication?.metadata?.content}</Markup>
          </a>
        </Link>
      )}
    </div>
  );
};

export default CollectedContent;
