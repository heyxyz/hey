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
      className="cursor-pointer rounded-md mb-4 px-2 py-1 flex items-start space-x-2 hover:bg-gray-300/20 md:flex"
      href="/notifications"
      onClick={() => {
        if (latestNotificationId) {
          setLastOpenedNotificationId(latestNotificationId);
        }
      }}
    >
      <BellIcon className="size-8" />
      {lastOpenedNotificationId !== latestNotificationId && (
        <span className="size-2 rounded-full bg-red-500 px-2 py-1"></span>
      )}
      <span className="text-white text-xl">Notifications</span> 
    </Link>
  );
};

export default NotificationIcon;
