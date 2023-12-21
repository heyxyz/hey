import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import NotificationIcon from '@components/Notification/NotificationIcon';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import getProfile from '@hey/lib/getProfile';
import cn from '@hey/ui/cn';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import useProfileStore from 'src/store/persisted/useProfileStore';

import MenuItems from './MenuItems';
import MoreNavItems from './MoreNavItems';
import Search from './Search';
import StaffBar from './StaffBar';

const Navbar: FC = () => {
  const router = useRouter();
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const staffMode = useFeatureFlagsStore((state) => state.staffMode);
  const preferences = usePreferencesStore((state) => state.preferences);
  const [showSearch, setShowSearch] = useState(false);

  const onProfileSelected = (profile: Profile) => {
    router.push(getProfile(profile).link);
  };

  interface NavItemProps {
    current: boolean;
    name: string;
    url: string;
  }

  const NavItem = ({ current, name, url }: NavItemProps) => {
    return (
      <Link
        className={cn(
          'outline-brand-500 cursor-pointer rounded-md px-2 py-1 text-left text-sm font-bold tracking-wide md:px-3',
          {
            'bg-gray-200 text-black dark:bg-gray-800 dark:text-white': current,
            'text-gray-700 hover:bg-gray-200 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white':
              !current
          }
        )}
        href={url}
      >
        {name}
      </Link>
    );
  };

  const NavItems = () => {
    const { pathname } = useRouter();

    return (
      <>
        <NavItem current={pathname === '/'} name="Home" url="/" />
        <NavItem
          current={pathname === '/explore'}
          name="Explore"
          url="/explore"
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
              type="button"
            >
              {showSearch ? (
                <XMarkIcon className="size-6" />
              ) : (
                <MagnifyingGlassIcon className="size-6" />
              )}
            </button>
            <Link
              className="outline-brand-500 hidden rounded-full outline-offset-8 md:block"
              href="/"
            >
              <img
                alt="Logo"
                className="size-8"
                height={32}
                src={preferences.isPride ? '/pride.png' : '/logo.png'}
                width={32}
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
            className={cn('md:hidden', !currentProfile?.id && 'ml-[60px]')}
            href="/"
          >
            <img
              alt="Logo"
              className="size-7"
              height={32}
              src={preferences.isPride ? '/pride.png' : '/logo.png'}
              width={32}
            />
          </Link>
          <div className="flex items-center gap-4">
            {currentProfile ? <NotificationIcon /> : null}
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
