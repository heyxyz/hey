import { HomeIcon, LightningBoltIcon, MailIcon, ViewGridIcon } from '@heroicons/react/outline';
import {
  HomeIcon as HomeIconSolid,
  LightningBoltIcon as LightningBoltIconSolid,
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
    <div className="fixed pb-safe flex items-center inset-x-0 bg-white border-t border-gray-200 dark:border-gray-800 dark:bg-black h-14 bottom-0 z-[4] md:hidden">
      <div className="grid grid-cols-4 w-full">
        <Link href="/" className="mx-auto">
          {isActivePath('/') ? (
            <HomeIconSolid className="w-7 h-7 text-indigo-500" />
          ) : (
            <HomeIcon className="w-7 h-7" />
          )}
        </Link>
        <Link href="/explore" className="mx-auto">
          {isActivePath('/explore') ? (
            <ViewGridIconSolid className="w-7 h-7 text-indigo-500" />
          ) : (
            <ViewGridIcon className="w-7 h-7" />
          )}
        </Link>
        <Link href="/notifications" className="mx-auto">
          {isActivePath('/notifications') ? (
            <LightningBoltIconSolid className="w-7 h-7 text-indigo-500" />
          ) : (
            <LightningBoltIcon className="w-7 h-7" />
          )}
        </Link>
        <Link href="/messages" className="mx-auto">
          {isActivePath('/messages') ? (
            <MailIconSolid className="w-7 h-7 text-indigo-500" />
          ) : (
            <MailIcon className="w-7 h-7" />
          )}
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
