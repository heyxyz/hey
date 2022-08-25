import Markup from '@components/Shared/Markup';
import { NewCollectNotification } from '@generated/types';
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
      {publicationType === 'crowdfund' ? (
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
