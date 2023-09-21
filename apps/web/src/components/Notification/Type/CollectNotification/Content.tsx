import Markup from '@components/Shared/Markup';
import type { NewCollectNotification } from '@lenster/lens';
import Link from 'next/link';
import type { FC } from 'react';

interface CollectedContentProps {
  notification: NewCollectNotification;
}

const CollectedContent: FC<CollectedContentProps> = ({ notification }) => {
  return (
    <Link
      href={`/posts/${notification?.collectedPublication?.id}`}
      className="linkify lt-text-gray-500 mt-2 line-clamp-2"
    >
      <Markup>{notification?.collectedPublication?.metadata?.content}</Markup>
    </Link>
  );
};

export default CollectedContent;
