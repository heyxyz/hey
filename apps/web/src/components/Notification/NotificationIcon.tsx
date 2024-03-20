import type { FC } from 'react';

import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useNotificationStore } from 'src/store/persisted/useNotificationStore';

const NotificationIcon: FC = () => {
  const {
    lastOpenedNotificationId,
    latestNotificationId,
    setLastOpenedNotificationId
  } = useNotificationStore();

  return (
    <Link
      className="hidden items-start justify-center rounded-md px-2 py-1 hover:bg-gray-300/20 md:flex"
      href="/notifications"
      onClick={() => {
        if (latestNotificationId) {
          setLastOpenedNotificationId(latestNotificationId);
        }
      }}
    >
      <BellIcon className="size-5 sm:size-6" />
      {lastOpenedNotificationId !== latestNotificationId ? (
        <span className="size-2 rounded-full bg-red-500" />
      ) : null}
    </Link>
  );
};

export default NotificationIcon;
