import type { FC } from 'react';

import { BellIcon as BellIconOutline } from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useNotificationStore } from 'src/store/persisted/useNotificationStore';

const NotificationIcon: FC = () => {
  const { pathname } = useRouter();
  const {
    lastOpenedNotificationId,
    latestNotificationId,
    setLastOpenedNotificationId
  } = useNotificationStore();

  const isNotificationPage = pathname === '/notifications';

  return (
    <Link
      className="cursor-pointer rounded-md mb-4 px-2 py-1 flex items-center space-x-2 hover:bg-gray-300/20 md:flex"
      href="/notifications"
      onClick={() => {
        if (latestNotificationId) {
          setLastOpenedNotificationId(latestNotificationId);
        }
      }}
    >
      {isNotificationPage ? (
        <BellIconSolid className="size-8 text-red-500" />
      ) : (
        <BellIconOutline className="size-8" />
      )}
      {lastOpenedNotificationId !== latestNotificationId && (
        <span className="size-2 rounded-full bg-red-500 px-2 py-1"></span>
      )}
      <span className="text-white text-xl font-bold">Notifications</span>
    </Link>
  );
};

export default NotificationIcon;
