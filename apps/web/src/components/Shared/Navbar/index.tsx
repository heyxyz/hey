import type { FC, ReactNode  } from 'react';
import { useEffect } from 'react';


import NotificationIcon from '@components/Notification/NotificationIcon';
import cn from '@good/ui/cn';
import {
  MagnifyingGlassIcon as MagnifyingGlassIconOutline,
  XMarkIcon as XMarkIconOutline,
  HomeIcon as HomeIconOutline,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  XMarkIcon as XMarkIconSolid
} from '@heroicons/react/24/solid';

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
    name: string;
    url: string;
    icon: ReactNode;
  }

  
  const NavItem: FC<NavItemProps> = ({ current, name, url, icon }) => {
    return (
      <Link
        className={cn(
          'cursor-pointer rounded-md px-2 py-1 mb-4 flex items-start space-x-2 hover:bg-gray-300/20 md:flex',
          {
            'bg-gray-200 text-black dark:bg-gray-800 dark:text-white': current,
            'text-gray-700 hover:bg-gray-200 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white': !current
          }
        )}
        href={url}
      >
        {icon}
        <div className={`dark:text-white text-black`}>
          <span className={` text-xl ${current ? 'font-bold' : ''}`}>{name}</span>
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
        name="Home"
         url="/" 
         icon={pathname === '/' ? <HomeIconSolid className="size-8" /> : <HomeIconOutline className="size-8" />}
         />


        <NavItem
          current={pathname === '/explore'}
          name="Explore"
          url="/explore"
          icon = {pathname ==='/explore' ?<MagnifyingGlassIconSolid className="size-8" /> :<MagnifyingGlassIconOutline className="size-8" />}
        />
      </>
    );
  };

  return (
    <header className="divider sticky top-0 z-10 w-full bg-white dark:bg-black ">
      {staffMode ? <StaffBar /> : null}
      <div className="flex container mx-auto max-w-screen-xl ">
        <div className=" relative flex flex-col h-full items-start justify-start ">
            
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
              <div className="inline-flex flex-grow justify-start items-start font-bold text-white-900">
                <div className="text-3xl font-black ml-6">
                  <img className="w-12 h-12" src="/logo1.svg" alt="Logo" />
                </div>
                <span className="flex flex-grow ml-3 mr-3">Goodcast</span>
              </div>
              </Link>
              <div className="hidden sm:ml-6 md:block pt-5  overflow-y-auto max-h-[70vh] overflow-x-hidden">
                <div className="flex flex-col items-start relative h-fit ">
                  <div className="hidden md:block">
                    {/* <Search /> */}
                  </div>
                  <NavItems />
                  <NotificationIcon />
                  <MessagesIcon />
                  <MoreNavItems />
                  <div className="w-full">
                    <button
                      className="mt-5 inline-flex items-center justify-center rounded-full text-black dark:text-white bg-custom-pink focus:outline-none px-4 py-2 w-full"
                      type="button"
                      style={{ backgroundColor: '#da5597' }}
                    >
                      <span className="text-xl">Post</span>
                    </button>
                  </div>
              {/**Profile section of navbar */}
              <div className={isShortScreen ? "flex items-start mt-4 justify-between" : "fixed  bottom-0  md:fixed"}>
              <Link className={cn('md:hidden max-h-[100vh]', !currentProfile?.id && 'ml-[60px]')} href="/">
                <img
                  alt="Logo"
                  className="size-7"
                  height={32}
                  src="/logo.png" //{`${STATIC_IMAGES_URL}/app-icon/${appIcon}.png`}
                  width={32}
                />
              </Link>
              <div id="profile" className="flex items-start mt-4 items-start justify-between">
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
