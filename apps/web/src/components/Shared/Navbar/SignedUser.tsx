import type { Profile } from '@good/lens';
import type { FC } from 'react';

import { FeatureFlag } from '@good/data/feature-flags';
import { KillSwitch } from '@good/data/kill-switches';
import getAvatar from '@good/helpers/getAvatar';
import getLennyURL from '@good/helpers/getLennyURL';
import getProfile from '@good/helpers/getProfile';
import { Image } from '@good/ui';
import cn from '@good/ui/cn';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import isFeatureAvailable from '@helpers/isFeatureAvailable';
import isFeatureEnabled from '@helpers/isFeatureEnabled';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import MenuTransition from '../MenuTransition';
import Slug from '../Slug';
import { NextLink } from './MenuItems';
import MobileDrawerMenu from './MobileDrawerMenu';
import AppVersion from './NavItems/AppVersion';
import Invites from './NavItems/Invites';
import Logout from './NavItems/Logout';
import OptimisticTransactions from './NavItems/OptimisticTransactions';
// import Score from './NavItems/Score';
import Settings from './NavItems/Settings';
import StaffMode from './NavItems/StaffMode';
import SwitchProfile from './NavItems/SwitchProfile';
import ThemeSwitch from './NavItems/ThemeSwitch';
import YourProfile from './NavItems/YourProfile';

const SignedUser: FC = () => {
  const { currentProfile } = useProfileStore();
  const { setShowMobileDrawer, showMobileDrawer } = useGlobalModalStateStore();

  const Avatar = () => (
    <Image
      alt={currentProfile?.id}
      className="size-12 cursor-pointer rounded-full border dark:border-gray-700"
      onError={({ currentTarget }) => {
        currentTarget.src = getLennyURL(currentProfile?.id);
      }}
      src={getAvatar(currentProfile as Profile)}
    />
  );

  const openMobileMenuDrawer = () => {
    setShowMobileDrawer(true);
  };

  return (
    <>
      {showMobileDrawer ? <MobileDrawerMenu /> : null}
      <button
        className="focus:outline-none md:hidden"
        onClick={() => openMobileMenuDrawer()}
        type="button"
      >
        <Avatar />
      </button>
      <Menu as="div" className="relative hidden md:block">
        <div className="bottom-0 flex items-center">
          <MenuButton className="flex items-center rounded-full hover:bg-gray-200 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
            <Avatar />
            <span className="text-sm">
              @{currentProfile?.handle?.localName}
            </span>
            <EllipsisHorizontalIcon className="ml-1 size-6" />
          </MenuButton>
        </div>
        <MenuTransition>
          <MenuItems
            className="absolute bottom-full right-0 mb-2 mt-2 w-48 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-black"
            static
          >
            <MenuItem
              as={NextLink}
              className="m-2 flex items-center rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              href={getProfile(currentProfile).link}
            >
              <div className="flex w-full flex-col">
                <div>Logged in as</div>
                <div className="truncate">
                  <Slug
                    className="font-bold"
                    slug={getProfile(currentProfile).slugWithPrefix}
                  />
                </div>
              </div>
            </MenuItem>
            <div className="divider" />
            <MenuItem
              as="div"
              className={({ focus }: { focus: boolean }) =>
                cn(
                  { 'dropdown-active': focus },
                  'm-2 rounded-lg border dark:border-gray-700'
                )
              }
            >
              <SwitchProfile />
            </MenuItem>
            <div className="divider" />
            <MenuItem
              as={NextLink}
              className={({ focus }: { focus: boolean }) =>
                cn({ 'dropdown-active': focus }, 'menu-item')
              }
              href={getProfile(currentProfile).link}
            >
              <YourProfile />
            </MenuItem>
            <MenuItem
              as={NextLink}
              className={({ focus }: { focus: boolean }) =>
                cn({ 'dropdown-active': focus }, 'menu-item')
              }
              href="/settings"
            >
              <Settings />
            </MenuItem>
            {isFeatureEnabled(KillSwitch.Invites) && (
              <MenuItem
                as="div"
                className={({ focus }: { focus: boolean }) =>
                  cn({ 'dropdown-active': focus }, 'm-2 rounded-lg')
                }
              >
                <Invites />
              </MenuItem>
            )}
            <MenuItem
              as="div"
              className={({ focus }) =>
                cn({ 'dropdown-active': focus }, 'm-2 rounded-lg')
              }
            >
              <Logout />
            </MenuItem>
            <div className="divider" />
            <MenuItem
              as="div"
              className={({ focus }) =>
                cn({ 'dropdown-active': focus }, 'm-2 rounded-lg')
              }
            >
              <ThemeSwitch />
            </MenuItem>
            <MenuItem
              as="div"
              className={({ focus }) =>
                cn({ 'dropdown-active': focus }, 'm-2 rounded-lg')
              }
            >
              <OptimisticTransactions />
            </MenuItem>
            {isFeatureAvailable(FeatureFlag.Staff) ? (
              <MenuItem
                as="div"
                className={({ focus }) =>
                  cn(
                    { 'bg-yellow-100 dark:bg-yellow-800': focus },
                    'm-2 rounded-lg'
                  )
                }
              >
                <StaffMode />
              </MenuItem>
            ) : null}
            <div className="divider" />
            <MenuItem
              as="div"
              className={({ focus }) =>
                cn({ 'dropdown-active': focus }, 'm-2 rounded-lg')
              }
            >
              {/* <Score /> */}
            </MenuItem>
            <div className="divider" />
            <AppVersion />
          </MenuItems>
        </MenuTransition>
      </Menu>
    </>
  );
};

export default SignedUser;
