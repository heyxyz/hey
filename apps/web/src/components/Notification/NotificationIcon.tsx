import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { FC } from 'react';

const NotificationIcon: FC = () => {
  return (
    <Link
      href="/notifications"
      className="hidden rounded-md p-1 hover:bg-gray-300/20"
    >
      <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
    </Link>
  );
};

export default NotificationIcon;
