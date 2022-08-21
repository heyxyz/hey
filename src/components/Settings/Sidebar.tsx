import UserProfile from '@components/Shared/UserProfile';
import { Profile } from '@generated/types';
import { ChipIcon, ExclamationIcon, FingerPrintIcon, ShareIcon, UserIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, ReactNode } from 'react';
import { useAppStore } from 'src/store/app';

interface MenuProps {
  children: ReactNode;
  current: boolean;
  url: string;
}

const Menu: FC<MenuProps> = ({ children, current, url }) => (
  <Link href={url}>
    <a
      href={url}
      className={clsx(
        'flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-brand-100 hover:text-brand dark:hover:bg-opacity-20 dark:bg-opacity-20 hover:bg-opacity-100',
        { 'bg-brand-100 text-brand font-bold': current }
      )}
    >
      {children}
    </a>
  </Link>
);

const Sidebar: FC = () => {
  const { pathname } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <div className="px-3 mb-4 space-y-1.5 sm:px-0">
      <div className="pb-3">
        <UserProfile profile={currentProfile as Profile} />
      </div>
      <Menu current={pathname == '/settings'} url="/settings">
        <UserIcon className="w-4 h-4" />
        <div>Profile</div>
      </Menu>
      <Menu current={pathname == '/settings/account'} url="/settings/account">
        <ChipIcon className="w-4 h-4" />
        <div>Account</div>
      </Menu>
      <Menu current={pathname == '/settings/dispatcher'} url="/settings/dispatcher">
        <FingerPrintIcon className="w-4 h-4" />
        <div>Dispatcher</div>
      </Menu>
      <Menu current={pathname == '/settings/allowance'} url="/settings/allowance">
        <ShareIcon className="w-4 h-4" />
        <div>Allowance</div>
      </Menu>
      <Menu current={pathname == '/settings/delete'} url="/settings/delete">
        <ExclamationIcon className="w-4 h-4 text-red-500" />
        <div className="text-red-500">Danger Zone</div>
      </Menu>
    </div>
  );
};

export default Sidebar;
