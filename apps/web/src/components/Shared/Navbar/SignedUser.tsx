import { Menu } from '@headlessui/react';
import { Trans } from '@lingui/macro';
import type { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import isGardener from 'lib/isGardener';
import isStaff from 'lib/isStaff';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import { Image } from 'ui';

import MenuTransition from '../MenuTransition';
import Slug from '../Slug';
import { NextLink } from './MenuItems';
import MobileDrawerMenu from './MobileDrawerMenu';
import AppVersion from './NavItems/AppVersion';
import Logout from './NavItems/Logout';
import Mod from './NavItems/Mod';
import ModMode from './NavItems/ModMode';
import Settings from './NavItems/Settings';
import StaffMode from './NavItems/StaffMode';
import Status from './NavItems/Status';
import SwitchProfile from './NavItems/SwitchProfile';
import ThemeSwitch from './NavItems/ThemeSwitch';
import YourProfile from './NavItems/YourProfile';

const SignedUser: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowMobileDrawer = useGlobalModalStateStore((state) => state.setShowMobileDrawer);
  const showMobileDrawer = useGlobalModalStateStore((state) => state.showMobileDrawer);

  const Avatar = () => (
    <Image
      onError={({ currentTarget }) => {
        currentTarget.src = getAvatar(currentProfile, false);
      }}
      src={getAvatar(currentProfile as Profile)}
      className="h-8 w-8 cursor-pointer rounded-full border dark:border-gray-700"
      alt={formatHandle(currentProfile?.handle)}
    />
  );

  const openMobileMenuDrawer = () => {
    setShowMobileDrawer(true);
  };

  return (
    <>
      {showMobileDrawer && <MobileDrawerMenu />}
      <button className="focus:outline-none md:hidden" onClick={() => openMobileMenuDrawer()}>
        <Avatar />
      </button>
      <Menu as="div" className="hidden md:block">
        <Menu.Button className="flex self-center">
          <Avatar />
        </Menu.Button>
        <MenuTransition>
          <Menu.Items static className="bg-dark absolute right-0 w-48 rounded-[2px] border border-gray-500">
            <Menu.Item
              as={NextLink}
              href={`/u/${formatHandle(currentProfile?.handle)}`}
              className="hover:bg-darker flex items-center px-4 py-2 text-sm text-white dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <span>
                <Trans>Logged in as</Trans>
                <div className="truncate">
                  <Slug
                    className="text-brand-500 font-medium"
                    slug={formatHandle(currentProfile?.handle)}
                    prefix="@"
                  />
                </div>
              </span>
            </Menu.Item>
            <Menu.Item as="div" className="bg-dark hover:bg-darker">
              <SwitchProfile className="hover:text-brand-500 text-xs uppercase text-gray-300" />
            </Menu.Item>
            <Menu.Item as="div" className="bg-dark hover:bg-darker uppercase">
              <Status className="hover:text-brand-500 text-xs uppercase text-gray-300 " />
            </Menu.Item>
            <div className="divider border-gray-700" />
            <Menu.Item
              as={NextLink}
              href={`/u/${formatHandle(currentProfile?.handle)}`}
              className="bg-dark hover:bg-darker flex px-4 py-2 uppercase"
            >
              <YourProfile className="hover:text-brand-500 text-xs text-gray-300" />
            </Menu.Item>
            <Menu.Item
              as={NextLink}
              href={'/settings'}
              className="bg-dark hover:bg-darker hover:text-brand-500 flex px-4 py-2 uppercase"
            >
              <Settings className="hover:text-brand-500 text-xs text-gray-300" />
            </Menu.Item>
            {isGardener(currentProfile?.id) && (
              <Menu.Item
                as={NextLink}
                href={'/mod'}
                className="bg-dark hover:bg-darker hover:text-brand-500 flex px-4 py-2 uppercase"
              >
                <Mod className="hover:text-brand-500 text-xs text-gray-300" />
              </Menu.Item>
            )}
            <Menu.Item as="div" className="bg-dark hover:bg-darker hover:text-brand-500 flex">
              <Logout className="hover:text-brand-500 text-xs uppercase text-gray-300" />
            </Menu.Item>
            <div className="divider border-gray-700" />
            <Menu.Item as="div" className="bg-dark hover:bg-darker hover:text-brand-500 flex">
              <ThemeSwitch className="hover:text-brand-500 text-xs uppercase text-gray-300" />
            </Menu.Item>
            {isGardener(currentProfile?.id) && (
              <Menu.Item as="div" className="bg-dark hover:bg-darker hover:text-brand-500 flex">
                <ModMode className="hover:text-brand-500 text-xs uppercase text-gray-300" />
              </Menu.Item>
            )}
            {isStaff(currentProfile?.id) && (
              <Menu.Item as="div" className="bg-dark hover:bg-darker hover:text-brand-500 flex">
                <StaffMode className="hover:text-brand-500 text-xs uppercase text-gray-300" />
              </Menu.Item>
            )}
            <AppVersion />
          </Menu.Items>
        </MenuTransition>
      </Menu>
    </>
  );
};

export default SignedUser;
