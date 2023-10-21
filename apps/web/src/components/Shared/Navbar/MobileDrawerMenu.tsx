import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Profile } from '@hey/lens';
import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import { Image } from '@hey/ui';
import cn from '@hey/ui/cn';
import Link from 'next/link';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/useGlobalModalStateStore';
import { usePreferencesStore } from 'src/store/usePreferencesStore';

import Slug from '../Slug';
import AppVersion from './NavItems/AppVersion';
import Bookmarks from './NavItems/Bookmarks';
import Contact from './NavItems/Contact';
import GardenerMode from './NavItems/GardenerMode';
import Invites from './NavItems/Invites';
import Logout from './NavItems/Logout';
import Mod from './NavItems/Mod';
import ReportBug from './NavItems/ReportBug';
import Settings from './NavItems/Settings';
import StaffMode from './NavItems/StaffMode';
import SwitchProfile from './NavItems/SwitchProfile';
import ThemeSwitch from './NavItems/ThemeSwitch';
import YourProfile from './NavItems/YourProfile';

const MobileDrawerMenu: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const isStaff = usePreferencesStore((state) => state.isStaff);
  const isGardener = usePreferencesStore((state) => state.isGardener);
  const setShowMobileDrawer = useGlobalModalStateStore(
    (state) => state.setShowMobileDrawer
  );

  const closeDrawer = () => {
    setShowMobileDrawer(false);
  };

  const itemClass = 'py-3 hover:bg-gray-100 dark:hover:bg-gray-800';

  return (
    <div className="no-scrollbar fixed inset-0 z-10 h-full w-full overflow-y-auto bg-gray-100 py-4 dark:bg-black md:hidden">
      <button className="px-5" type="button" onClick={closeDrawer}>
        <XMarkIcon className="h-6 w-6" />
      </button>
      <div className="w-full space-y-2">
        <Link
          onClick={closeDrawer}
          href={getProfile(currentProfile).link}
          className="mt-2 flex items-center space-x-2 px-5 py-3 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <div className="flex w-full space-x-1.5">
            <Image
              src={getAvatar(currentProfile as Profile)}
              className="h-12 w-12 cursor-pointer rounded-full border dark:border-gray-700"
              alt={currentProfile?.id}
            />
            <div>
              Logged in as
              <div className="truncate">
                <Slug
                  className="font-bold"
                  slug={getProfile(currentProfile).slug}
                  prefix={getProfile(currentProfile).prefix}
                />
              </div>
            </div>
          </div>
        </Link>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <SwitchProfile className={cn(itemClass, 'px-4')} />
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <div>
            <Link href={getProfile(currentProfile).link} onClick={closeDrawer}>
              <YourProfile className={cn(itemClass, 'px-4')} />
            </Link>
            <Link href="/settings" onClick={closeDrawer}>
              <Settings className={cn(itemClass, 'px-4')} />
            </Link>
            <Bookmarks
              className={cn(itemClass, 'px-4')}
              onClick={closeDrawer}
            />
            {isGardener ? (
              <Link href="/mod" onClick={closeDrawer}>
                <Mod className={cn(itemClass, 'px-4')} />
              </Link>
            ) : null}
            <Invites className={cn(itemClass, 'px-4')} />
            <ThemeSwitch
              className={cn(itemClass, 'px-4')}
              onClick={closeDrawer}
            />
          </div>
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <div>
            <Contact className={cn(itemClass, 'px-4')} onClick={closeDrawer} />
            <ReportBug
              className={cn(itemClass, 'px-4')}
              onClick={closeDrawer}
            />
          </div>
          <div className="divider" />
        </div>

        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <div className="hover:bg-gray-100 dark:hover:bg-gray-800">
            <Logout
              onClick={closeDrawer}
              className={cn(itemClass, 'px-4 py-3')}
            />
          </div>
          <div className="divider" />
          {isGardener ? (
            <>
              <div
                onClick={closeDrawer}
                className="hover:bg-gray-200 dark:hover:bg-gray-800"
                aria-hidden="true"
              >
                <GardenerMode className={cn(itemClass, 'px-4 py-3')} />
              </div>
              <div className="divider" />
            </>
          ) : null}
          {isStaff ? (
            <>
              <div
                onClick={closeDrawer}
                className="hover:bg-gray-200 dark:hover:bg-gray-800"
                aria-hidden="true"
              >
                <StaffMode className={cn(itemClass, 'px-4 py-3')} />
              </div>
              <div className="divider" />
            </>
          ) : null}
        </div>
        {currentProfile ? <AppVersion /> : null}
      </div>
    </div>
  );
};

export default MobileDrawerMenu;
