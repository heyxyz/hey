import type { FC, ReactNode } from 'react';

import NotificationIcon from '@components/Notification/NotificationIcon';
import cn from '@good/ui/cn';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import MenuItems from './MenuItems';
import MessagesIcon from './MessagesIcon';
import ModIcon from './ModIcon';
import MoreNavItems from './MoreNavItems';
import Search from './Search';
import StaffBar from './StaffBar';

const Navbar: FC = () => {
  const { currentProfile } = useProfileStore();
  const { staffMode } = useFeatureFlagsStore();
  const { appIcon } = usePreferencesStore();
  const [showSearch, setShowSearch] = useState(false);

  interface NavItemProps {
    current: boolean;
    icon: ReactNode;
    name: string;
    url: string;
  }

  const NavItem: FC<NavItemProps> = ({ current, icon, name, url }) => {
    return (
      <Link
        className={cn(
          '"cursor-pointer flex items-start space-x-2 rounded-md px-2 py-1 hover:bg-gray-300/20 md:flex',
          {
            'bg-gray-200 text-black dark:bg-gray-800 dark:text-white': current,
            'text-gray-700 hover:bg-gray-200 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white':
              !current
          }
        )}
        href={url}
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  };

  const NavItems = () => {
    const { pathname } = useRouter();

    return (
      <>
        <NavItem
          current={pathname === '/'}
          icon={<HomeIcon className="size-6" />}
          name="Home"
          url="/"
        />

        <NavItem
          current={pathname === '/explore'}
          icon={<MagnifyingGlassIcon className="size-6" />}
          name="Explore"
          url="/explore"
        />
      </>
    );
  };

  return (
    <header className="divider sticky top-0 z-10 w-full bg-white dark:bg-black">
      {staffMode ? <StaffBar /> : null}
      <div className="container mx-auto max-w-screen-xl px-5">
        <div className="relative flex h-14 flex-col items-start justify-start sm:h-16">
          <div className="flex flex-col items-start justify-start">
            <button
              className="inline-flex items-start justify-start rounded-md text-gray-500 focus:outline-none md:hidden"
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
              // className="hidden rounded-full outline-offset-8 md:block"
              href="/"
            >
              <div className="text-white-900 inline-flex flex-grow items-start justify-start font-bold">
                <span className="fle-grow ml-3 mr-3 flex">Goodcast</span>
              </div>
            </Link>
            <div className="hidden pt-5 sm:ml-6 md:block">
              <div className="flex flex-col items-start space-x-4">
                <div className="hidden md:block">{/* <Search /> */}</div>
                <NavItems />
                <NotificationIcon />
                <MessagesIcon />
                <MoreNavItems />
                <Link
                  className={cn(
                    'md:hidden',
                    !currentProfile?.id && 'ml-[60px]'
                  )}
                  href="/"
                >
                  <img
                    alt="Logo"
                    className="size-7"
                    height={32}
                    src="/logo.png" //{`${STATIC_IMAGES_URL}/app-icon/${appIcon}.png`}
                    width={32}
                  />
                </Link>
                <div className="flex items-start justify-start gap-4">
                  {currentProfile ? <ModIcon /> : null}
                  <MenuItems />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSearch ? (
        <div className="m-3 md:hidden">
          <Search />
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
