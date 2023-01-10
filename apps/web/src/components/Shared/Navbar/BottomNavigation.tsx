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
    <div className="fixed pb-safe inset-x-0 bg-white border-t border-gray-200 dark:border-gray-800 dark:bg-black bottom-0 z-10 md:hidden">
      <div className="grid grid-cols-4">
        <Link href="/" className="my-3 mx-auto">
          {isActivePath('/') ? (
            <HomeIconSolid className="w-6 h-6 text-brand-500" />
          ) : (
            <HomeIcon className="w-6 h-6" />
          )}
        </Link>
        <Link href="/explore" className="my-3 mx-auto">
          {isActivePath('/explore') ? (
            <ViewGridIconSolid className="w-6 h-6 text-brand-500" />
          ) : (
            <ViewGridIcon className="w-6 h-6" />
          )}
        </Link>
        <Link href="/notifications" className="my-3 mx-auto">
          {isActivePath('/notifications') ? (
            <LightningBoltIconSolid className="w-6 h-6 text-brand-500" />
          ) : (
            <LightningBoltIcon className="w-6 h-6" />
          )}
        </Link>
        <Link href="/messages" className="my-3 mx-auto">
          {isActivePath('/messages') ? (
            <MailIconSolid className="w-6 h-6 text-brand-500" />
          ) : (
            <MailIcon className="w-6 h-6" />
          )}
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
