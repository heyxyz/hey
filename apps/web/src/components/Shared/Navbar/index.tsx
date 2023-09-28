import MessageIcon from '@components/Messages/MessageIcon';
import NotificationIcon from '@components/Notification/NotificationIcon';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Profile } from '@hey/lens';
import formatHandle from '@hey/lib/formatHandle';
import cn from '@hey/ui/cn';
import { t } from '@lingui/macro';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { usePreferencesStore } from 'src/store/preferences';

import MenuItems from './MenuItems';
import MoreNavItems from './MoreNavItems';
import Search from './Search';
import StaffBar from './StaffBar';

const Navbar: FC = () => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const staffMode = usePreferencesStore((state) => state.staffMode);
  const isPride = usePreferencesStore((state) => state.isPride);
  const [showSearch, setShowSearch] = useState(false);

  const onProfileSelected = (profile: Profile) => {
    router.push(`/u/${formatHandle(profile?.handle)}`);
  };

  interface NavItemProps {
    url: string;
    name: string;
    current: boolean;
  }

  const NavItem = ({ url, name, current }: NavItemProps) => {
    return (
      <Link
        href={url}
        className={cn(
          'cursor-pointer rounded-md px-2 py-1 text-left text-sm font-bold tracking-wide md:px-3',
          {
            'bg-gray-200 text-black dark:bg-gray-800 dark:text-white': current,
            'text-gray-700 hover:bg-gray-200 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white':
              !current
          }
        )}
        aria-current={current ? 'page' : undefined}
        data-testid={`nav-item-${name.toLowerCase()}`}
      >
        {name}
      </Link>
    );
  };

  const NavItems = () => {
    const { pathname } = useRouter();

    return (
      <>
        <NavItem url="/" name={t`Home`} current={pathname === '/'} />
        <NavItem
          url="/explore"
          name={t`Explore`}
          current={pathname === '/explore'}
        />
        <MoreNavItems />
      </>
    );
  };

  return (
    <header className="divider sticky top-0 z-10 w-full bg-white dark:bg-black">
      {staffMode ? <StaffBar /> : null}
      <div className="container mx-auto max-w-screen-xl px-5">
        <div className="relative flex h-14 items-center justify-between sm:h-16">
          <div className="flex items-center justify-start">
            <button
              className="inline-flex items-center justify-center rounded-md text-gray-500 focus:outline-none md:hidden"
              onClick={() => setShowSearch(!showSearch)}
            >
              {showSearch ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <MagnifyingGlassIcon className="h-6 w-6" />
              )}
            </button>
            <Link href="/" className="hidden md:block">
              <img
                className="h-8 w-8"
                height={32}
                width={32}
                src={isPride ? '/pride.png' : '/logo.png'}
                alt="Logo"
              />
            </Link>
            <div className="hidden sm:ml-6 md:block">
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <Search onProfileSelected={onProfileSelected} />
                </div>
                <NavItems />
              </div>
            </div>
          </div>
          <Link
            href="/"
            className={cn('md:hidden', !currentProfile?.id && 'ml-[60px]')}
          >
            <img
              className="h-7 w-7"
              height={32}
              width={32}
              src={isPride ? '/pride.png' : '/logo.png'}
              alt="Logo"
            />
          </Link>
          <div className="flex items-center gap-4">
            {currentProfile ? (
              <>
                <MessageIcon />
                <NotificationIcon />
              </>
            ) : null}
            <MenuItems />
          </div>
        </div>
      </div>
      {showSearch ? (
        <div className="m-3 md:hidden">
          <Search hideDropdown onProfileSelected={onProfileSelected} />
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
