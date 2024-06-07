import type { FC } from 'react';

import { STATIC_IMAGES_URL } from '@good/data/constants';
import cn from '@good/ui/cn';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { usePreferencesStore } from 'src/store/non-persisted/usePreferencesStore';
// import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import LoginButton from '../LoginButton';
import SignedUser from './SignedUser';
import MoreNavItems from './MoreNavItems';
// import StaffBar from './StaffBar';

const Navbar: FC = () => {
  const { currentProfile } = useProfileStore();
  // const { staffMode } = useFeatureFlagsStore();
  const { appIcon } = usePreferencesStore();

  interface NavItemProps {
    current: boolean;
    name: string;
    url: string;
  }

  const NavItem = ({ current, name, url }: NavItemProps) => {
    return (
      <Link
        className={cn(
          'cursor-pointer rounded-md px-2 py-1 text-left text-sm font-bold tracking-wide md:px-3',
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

  const { pathname } = useRouter();

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-black w-48 md:w-16 lg:w-48 h-screen overflow-y-scroll">
      {/* {staffMode ? <StaffBar /> : null} */}
      <div className="h-screen flex flex-col">
        <Link
          className="rounded-full outline-offset-8 my-12"
          href="/"
        >
          <img
            alt="Logo"  
            className="size-8"
            height={32}
            src={`${STATIC_IMAGES_URL}/app-icon/${appIcon}.png`}
            width={32}
          />
        </Link>
        <NavItem current={pathname === '/'} name="Home" url="/" />
        <NavItem
          current={pathname === '/explore'}
          name="Explore"
          url="/explore"
        />
        <div className='relative'>
          <MoreNavItems />
        </div>
        <NavItem
          current={pathname === '/messages'}
          name="Messages"
          url="/messages"
        />
        <NavItem
          current={pathname === '/notifications'}
          name="Notifications"
          url="/notifications"
        />
        <div className='relative pb-8 self-stretch flex justify-center items-center mt-auto'>
          {currentProfile ? <SignedUser /> : <LoginButton />}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
