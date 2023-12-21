import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { FeatureFlag } from '@hey/data/feature-flags';
import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import { Image } from '@hey/ui';
import cn from '@hey/ui/cn';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import Link from 'next/link';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import useProfileStore from 'src/store/persisted/useProfileStore';

import Slug from '../Slug';
import AppVersion from './NavItems/AppVersion';
import Bookmarks from './NavItems/Bookmarks';
import GardenerMode from './NavItems/GardenerMode';
import Invites from './NavItems/Invites';
import Logout from './NavItems/Logout';
import Mod from './NavItems/Mod';
import Pro from './NavItems/Pro';
import Settings from './NavItems/Settings';
import StaffMode from './NavItems/StaffMode';
import Support from './NavItems/Support';
import SwitchProfile from './NavItems/SwitchProfile';
import ThemeSwitch from './NavItems/ThemeSwitch';
import YourProfile from './NavItems/YourProfile';

const MobileDrawerMenu: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const setShowMobileDrawer = useGlobalModalStateStore(
    (state) => state.setShowMobileDrawer
  );

  const closeDrawer = () => {
    setShowMobileDrawer(false);
  };

  const itemClass = 'py-3 hover:bg-gray-100 dark:hover:bg-gray-800';

  return (
    <div className="no-scrollbar fixed inset-0 z-10 h-full w-full overflow-y-auto bg-gray-100 py-4 md:hidden dark:bg-black">
      <button className="px-5" onClick={closeDrawer} type="button">
        <XMarkIcon className="size-6" />
      </button>
      <div className="w-full space-y-2">
        <Link
          className="mt-2 flex items-center space-x-2 px-5 py-3 hover:bg-gray-200 dark:hover:bg-gray-800"
          href={getProfile(currentProfile).link}
          onClick={closeDrawer}
        >
          <div className="flex w-full space-x-1.5">
            <Image
              alt={currentProfile?.id}
              className="size-12 cursor-pointer rounded-full border dark:border-gray-700"
              src={getAvatar(currentProfile as Profile)}
            />
            <div>
              Logged in as
              <div className="truncate">
                <Slug
                  className="font-bold"
                  slug={getProfile(currentProfile).slugWithPrefix}
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
            {isFeatureEnabled(FeatureFlag.Gardener) ? (
              <Link href="/mod" onClick={closeDrawer}>
                <Mod className={cn(itemClass, 'px-4')} />
              </Link>
            ) : null}
            <Invites className={cn(itemClass, 'px-4')} />
            {isFeatureEnabled(FeatureFlag.Pro) && (
              <Link href="/pro" onClick={closeDrawer}>
                <Pro className={cn(itemClass, 'px-4')} />
              </Link>
            )}
            <ThemeSwitch
              className={cn(itemClass, 'px-4')}
              onClick={closeDrawer}
            />
          </div>
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <Support className={cn(itemClass, 'px-4')} onClick={closeDrawer} />
          <div className="divider" />
        </div>

        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <div className="hover:bg-gray-100 dark:hover:bg-gray-800">
            <Logout
              className={cn(itemClass, 'px-4 py-3')}
              onClick={closeDrawer}
            />
          </div>
          <div className="divider" />
          {isFeatureEnabled(FeatureFlag.Gardener) ? (
            <>
              <div
                className="hover:bg-gray-200 dark:hover:bg-gray-800"
                onClick={closeDrawer}
              >
                <GardenerMode className={cn(itemClass, 'px-4 py-3')} />
              </div>
              <div className="divider" />
            </>
          ) : null}
          {isFeatureEnabled(FeatureFlag.Staff) ? (
            <>
              <div
                className="hover:bg-gray-200 dark:hover:bg-gray-800"
                onClick={closeDrawer}
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
