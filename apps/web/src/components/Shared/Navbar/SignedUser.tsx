import { Button } from '@components/UI/Button';
import { Menu } from '@headlessui/react';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import formatHandle from '@lib/formatHandle';
import getAvatar from '@lib/getAvatar';
import isGardener from '@lib/isGardener';
import isStaff from '@lib/isStaff';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { Profile } from 'lens';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';

import MenuTransition from '../MenuTransition';
import Slug from '../Slug';
import { NextLink } from './MenuItems';
import MobileDrawerMenu from './MobileDrawerMenu';
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
  const setShowProfileSwitchModal = useGlobalModalStateStore((state) => state.setShowProfileSwitchModal);
  const setShowMobileDrawer = useGlobalModalStateStore((state) => state.setShowMobileDrawer);
  const showMobileDrawer = useGlobalModalStateStore((state) => state.showMobileDrawer);

  const Avatar = () => (
    <img
      src={getAvatar(currentProfile as Profile)}
      className="w-8 h-8 rounded-full border cursor-pointer dark:border-gray-700"
      alt={formatHandle(currentProfile?.handle)}
    />
  );

  const openMobileMenuDrawer = () => {
    setShowMobileDrawer(true);
  };

  return (
    <>
      {showMobileDrawer && <MobileDrawerMenu />}
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
              className="text-sm items-center flex p-3 w-full"
            >
              <div className="flex items-center justify-between flex-1">
                <span>
                  <Trans>Logged in as</Trans>
                  <div className="truncate">
                    <Slug className="font-bold" slug={formatHandle(currentProfile?.handle)} prefix="@" />
                  </div>
                </span>
                {profiles.length > 1 && (
                  <Button
                    outline
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowProfileSwitchModal(true);
                    }}
                  >
                    <SwitchHorizontalIcon className="w-4 h-4 text-brand-500" />
                  </Button>
                )}
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
