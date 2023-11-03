import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { FC } from 'react';
import { useNotificationPersistStore } from 'src/store/useNotificationPersistStore';

const NotificationIcon: FC = () => {
  const {
    latestNotificationId,
    lastOpenedNotificationId,
    setLastOpenedNotificationId
  } = useNotificationPersistStore();

  return (
    <Link
      href="/notifications"
      className="min-w-[40px] items-start justify-center rounded-md p-1 hover:bg-gray-300/20 md:flex"
      onClick={() => {
        if (latestNotificationId) {
          setLastOpenedNotificationId(latestNotificationId);
        }
      }}
    >
      <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      {lastOpenedNotificationId !== latestNotificationId ? (
        <span className="h-2 w-2 rounded-full bg-red-500" />
      ) : null}
    </Link>
  );
};

export default NotificationIcon;
