import type { FC, ReactNode } from 'react';

import NavPost from '@components/Composer/Post/NavPost';
import NotificationIcon from '@components/Notification/NotificationIcon';
import cn from '@good/ui/cn';
import {
  HomeIcon as HomeIconOutline,
  MagnifyingGlassIcon as MagnifyingGlassIconOutline
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  XMarkIcon as XMarkIconSolid
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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
  const [isShortScreen, setIsShortScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsShortScreen(window.innerHeight < 500);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          'mb-4 flex cursor-pointer items-start space-x-2 rounded-md px-2 py-1 hover:bg-gray-300/20 md:flex',
          {
            'bg-gray-200 text-black dark:bg-gray-800 dark:text-white': current,
            'text-gray-700 hover:bg-gray-200 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white':
              !current
          }
        )}
        href={url}
      >
        {icon}
        <div className={`text-black dark:text-white`}>
          <span className={`text-xl ${current ? 'font-bold' : ''}`}>
            {name}
          </span>
        </div>
      </Link>
    );
  };

  const NavItems = () => {
    const { pathname } = useRouter();

    return (
      <>
        <NavItem
          current={pathname === '/'}
          icon={
            pathname === '/' ? (
              <HomeIconSolid className="size-8" />
            ) : (
              <HomeIconOutline className="size-8" />
            )
          }
          name="Home"
          url="/"
        />

        <NavItem
          current={pathname === '/explore'}
          icon={
            pathname === '/explore' ? (
              <MagnifyingGlassIconSolid className="size-8" />
            ) : (
              <MagnifyingGlassIconOutline className="size-8" />
            )
          }
          name="Explore"
          url="/explore"
        />
      </>
    );
  };

  return (
    <header className="divider sticky top-0 z-10 w-full bg-white dark:bg-black">
      {staffMode ? <StaffBar /> : null}
      <div className="container mx-auto flex max-w-screen-xl">
        <div className="relative flex h-full flex-col items-start justify-start">
          <button
            className="inline-flex items-start justify-start rounded-md text-gray-500 focus:outline-none md:hidden"
            onClick={() => setShowSearch(!showSearch)}
            type="button"
          >
            {showSearch ? (
              <XMarkIconSolid className="size-6" />
            ) : (
              <MagnifyingGlassIconSolid className="size-8" />
            )}
          </button>
          <Link
            // className="hidden rounded-full outline-offset-8 md:block"
            href="/"
          >
            <div className="text-white-900 inline-flex flex-grow items-start justify-start font-bold">
              <div className="ml-6 text-3xl font-black">
                <img alt="Logo" className="h-12 w-12" src="/logo1.svg" />
              </div>
              <span className="ml-3 mr-3 flex flex-grow">Goodcast</span>
            </div>
          </Link>
          <div className="hidden max-h-[70vh] overflow-y-auto overflow-x-hidden pt-5 sm:ml-6 md:block">
            <div className="relative flex h-fit flex-col items-start">
              <div className="hidden md:block">{/* <Search /> */}</div>
              <NavItems />
              <NotificationIcon />
              <MessagesIcon />
              <MoreNavItems />
              <div className="w-full">
                <NavPost />
              </div>
              {/**Profile section of navbar */}
              <div
                className={
                  isShortScreen
                    ? 'mt-4 flex items-start justify-between'
                    : 'fixed bottom-0 md:fixed'
                }
              >
                <Link
                  className={cn(
                    'max-h-[100vh] md:hidden',
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
                <div
                  className="mt-4 flex items-start justify-between"
                  id="profile"
                >
                  <div className="flex items-center gap-2">
                    <MenuItems /> {/* Profile Submenu Section */}
                    <ModIcon />
                  </div>
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
