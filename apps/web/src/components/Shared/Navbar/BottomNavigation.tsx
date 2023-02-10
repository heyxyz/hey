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
    <div className="pb-safe fixed inset-x-0 bottom-0 z-[5] border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-black md:hidden">
      <div className="grid grid-cols-4">
        <Link href="/" className="my-3 mx-auto">
          {isActivePath('/') ? (
            <HomeIconSolid className="text-brand-500 h-6 w-6" />
          ) : (
            <HomeIcon className="h-6 w-6" />
          )}
        </Link>
        <Link href="/explore" className="my-3 mx-auto">
          {isActivePath('/explore') ? (
            <ViewGridIconSolid className="text-brand-500 h-6 w-6" />
          ) : (
            <ViewGridIcon className="h-6 w-6" />
          )}
        </Link>
        <Link href="/notifications" className="my-3 mx-auto">
          {isActivePath('/notifications') ? (
            <LightningBoltIconSolid className="text-brand-500 h-6 w-6" />
          ) : (
            <LightningBoltIcon className="h-6 w-6" />
          )}
        </Link>
        <Link href="/messages" className="my-3 mx-auto">
          {isActivePath('/messages') ? (
            <MailIconSolid className="text-brand-500 h-6 w-6" />
          ) : (
            <MailIcon className="h-6 w-6" />
          )}
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
