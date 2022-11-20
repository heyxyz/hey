import Markup from '@components/Shared/Markup';
import type { NewCollectNotification } from 'lens';
import Link from 'next/link';
import type { FC } from 'react';

interface Props {
  notification: NewCollectNotification;
}

const CollectedContent: FC<Props> = ({ notification }) => {
  return (
    <Link
      href={`/posts/${notification?.collectedPublication?.id}`}
      className="linkify text-gray-500 line-clamp-2 mt-2"
    >
      <Markup>{notification?.collectedPublication?.metadata?.content}</Markup>
    </Link>
  );
};

export default CollectedContent;
