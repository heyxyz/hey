import { Menu } from '@headlessui/react';
import { CheckCircleIcon, SwitchHorizontalIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import formatHandle from '@lib/formatHandle';
import getAvatar from '@lib/getAvatar';
import isGardener from '@lib/isGardener';
import isStaff from '@lib/isStaff';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { Profile } from 'lens';
import type { FC } from 'react';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { PROFILE } from 'src/tracking';

import MenuTransition from '../MenuTransition';
import Slug from '../Slug';
import { NextLink } from './MenuItems';
import AppVersion from './NavItems/AppVersion';
import Logout from './NavItems/Logout';
import Mod from './NavItems/Mod';
import Settings from './NavItems/Settings';
import StaffMode from './NavItems/StaffMode';
import Status from './NavItems/Status';
import ThemeSwitch from './NavItems/ThemeSwitch';
import YourProfile from './NavItems/YourProfile';

const SignedUser: FC = () => {
  const profiles = useAppStore((state) => state.profiles);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);

  const Avatar = () => (
    <img
      src={getAvatar(currentProfile as Profile)}
      className="w-8 h-8 rounded-full border cursor-pointer dark:border-gray-700"
      alt={formatHandle(currentProfile?.handle)}
    />
  );

  const openMobileMenuDrawer = () => {
    document.getElementById('mobile-drawer')?.classList.remove('hidden');
  };

  return (
    <>
      <button className="md:hidden focus:outline-none" onClick={() => openMobileMenuDrawer()}>
        <Avatar />
      </button>
      <Menu as="div" className="hidden md:block">
        <Menu.Button className="flex self-center">
          <Avatar />
        </Menu.Button>
        <MenuTransition>
          <Menu.Items
            static
            className="absolute right-0 py-1 mt-2 w-48 bg-white rounded-xl border shadow-sm dark:bg-black focus:outline-none dark:border-gray-700"
          >
            <Menu.Item
              as={NextLink}
              href={`/u/${formatHandle(currentProfile?.handle)}`}
              className={({ active }: { active: boolean }) =>
                clsx({ 'dropdown-active': active }, 'menu-item')
              }
            >
              <div>
                <Trans>Logged in as</Trans>
              </div>
              <div className="truncate">
                <Slug className="font-bold" slug={formatHandle(currentProfile?.handle)} prefix="@" />
              </div>
            </Menu.Item>
            <div className="divider" />
            <Menu.Item
              as="div"
              className={({ active }: { active: boolean }) =>
                clsx({ 'dropdown-active': active }, 'menu-item border dark:border-gray-700')
              }
            >
              <Status />
            </Menu.Item>
            <div className="divider" />
            <Menu.Item
              as="div"
              className={({ active }: { active: boolean }) =>
                clsx({ 'dropdown-active': active }, 'menu-item')
              }
            >
              <YourProfile />
            </Menu.Item>
            <Menu.Item
              as="div"
              className={({ active }: { active: boolean }) =>
                clsx({ 'dropdown-active': active }, 'menu-item')
              }
            >
              <Settings />
            </Menu.Item>
            {isGardener(currentProfile?.id) && (
              <Menu.Item
                as="div"
                className={({ active }: { active: boolean }) =>
                  clsx({ 'dropdown-active': active }, 'menu-item')
                }
              >
                <Mod />
              </Menu.Item>
            )}
            <Menu.Item as="div" className={({ active }) => clsx({ 'dropdown-active': active }, 'menu-item')}>
              <Logout />
            </Menu.Item>
            {profiles?.length > 1 && (
              <>
                <div className="divider" />
                <div className="overflow-auto m-2 max-h-36 no-scrollbar">
                  <div className="flex items-center px-4 pt-1 pb-2 space-x-1.5 text-sm font-bold lt-text-gray-500">
                    <SwitchHorizontalIcon className="w-4 h-4" />
                    <div>
                      <Trans>Switch to</Trans>
                    </div>
                  </div>
                  {profiles.map((profile: Profile, index) => (
                    <div
                      key={profile?.id}
                      className="block text-sm text-gray-700 rounded-lg cursor-pointer dark:text-gray-200"
                    >
                      <button
                        type="button"
                        className="flex items-center py-1.5 px-4 space-x-2 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => {
                          const selectedProfile = profiles[index];
                          setCurrentProfile(selectedProfile);
                          setProfileId(selectedProfile.id);
                          Analytics.track(PROFILE.SWITCH_PROFILE);
                        }}
                      >
                        {currentProfile?.id === profile?.id && (
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        )}
                        <img
                          className="w-5 h-5 rounded-full border dark:border-gray-700"
                          height={20}
                          width={20}
                          src={getAvatar(profile)}
                          alt={formatHandle(profile?.handle)}
                        />
                        <div className="truncate">{formatHandle(profile?.handle)}</div>
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="divider" />
            <Menu.Item as="div" className={({ active }) => clsx({ 'dropdown-active': active }, 'menu-item')}>
              <ThemeSwitch />
            </Menu.Item>
            {currentProfile && (
              <>
                <div className="divider" />
                <AppVersion />
              </>
            )}
            {isStaff(currentProfile?.id) && (
              <>
                <div className="divider" />
                <Menu.Item
                  as="div"
                  className={({ active }) =>
                    clsx({ 'bg-yellow-100 dark:bg-yellow-800': active }, 'menu-item')
                  }
                >
                  <StaffMode />
                </Menu.Item>
              </>
            )}
          </Menu.Items>
        </MenuTransition>
      </Menu>
    </>
  );
};

export default SignedUser;
