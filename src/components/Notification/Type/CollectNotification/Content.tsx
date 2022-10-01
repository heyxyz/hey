import Markup from '@components/Shared/Markup';
import { NewCollectNotification } from '@generated/types';
import Link from 'next/link';
import React, { FC } from 'react';

interface Props {
  notification: NewCollectNotification;
}

const CollectedContent: FC<Props> = ({ notification }) => {
  return (
    <div className="text-gray-500 line-clamp-2 mt-2">
      <Link href={`/posts/${notification?.collectedPublication?.id}`} className="linkify">
        <Markup>{notification?.collectedPublication?.metadata?.content}</Markup>
      </Link>
    </div>
  );
};

export default CollectedContent;
