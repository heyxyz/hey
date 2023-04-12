import { BellIcon, HomeIcon, MailIcon, ViewGridIcon } from '@heroicons/react/outline';
import {
  BellIcon as BellIconSolid,
  HomeIcon as HomeIconSolid,
  MailIcon as MailIconSolid,
  ViewGridIcon as ViewGridIconSolid
} from '@heroicons/react/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const BottomNavigation = () => {
  const router = useRouter();
  const isActivePath = (path: string) => router.pathname === path;

  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-[5] border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-black md:hidden">
      <div className="grid grid-cols-4">
        <Link href="/" className="mx-auto my-3">
          {isActivePath('/') ? (
            <HomeIconSolid className="text-brand h-6 w-6" />
          ) : (
            <HomeIcon className="h-6 w-6" />
          )}
        </Link>
        <Link href="/explore" className="mx-auto my-3">
          {isActivePath('/explore') ? (
            <ViewGridIconSolid className="text-brand h-6 w-6" />
          ) : (
            <ViewGridIcon className="h-6 w-6" />
          )}
        </Link>
        <Link href="/notifications" className="mx-auto my-3">
          {isActivePath('/notifications') ? (
            <BellIconSolid className="text-brand h-6 w-6" />
          ) : (
            <BellIcon className="h-6 w-6" />
          )}
        </Link>
        <Link href="/messages" className="mx-auto my-3">
          {isActivePath('/messages') ? (
            <MailIconSolid className="text-brand h-6 w-6" />
          ) : (
            <MailIcon className="h-6 w-6" />
          )}
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
