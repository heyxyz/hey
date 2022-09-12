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
          {notification?.collectedPublication?.metadata?.name}
        </Link>
      ) : (
        <Link href={`/posts/${notification?.collectedPublication?.id}`} className="linkify">
          <Markup>{notification?.collectedPublication?.metadata?.content}</Markup>
        </Link>
      )}
    </div>
  );
};

export default CollectedContent;
