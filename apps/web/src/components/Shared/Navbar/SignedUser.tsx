import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { FeatureFlag } from '@hey/data/feature-flags';
import getAvatar from '@hey/lib/getAvatar';
import getLennyURL from '@hey/lib/getLennyURL';
import getProfile from '@hey/lib/getProfile';
import { Image } from '@hey/ui';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import useProfileStore from 'src/store/persisted/useProfileStore';

import Slug from '../Slug';
import { NextLink } from './MenuItems';
import MobileDrawerMenu from './MobileDrawerMenu';
import AppVersion from './NavItems/AppVersion';
import GardenerMode from './NavItems/GardenerMode';
import Invites from './NavItems/Invites';
import Logout from './NavItems/Logout';
import Mod from './NavItems/Mod';
import Pro from './NavItems/Pro';
import Settings from './NavItems/Settings';
import StaffMode from './NavItems/StaffMode';
import SwitchProfile from './NavItems/SwitchProfile';
import ThemeSwitch from './NavItems/ThemeSwitch';
import YourProfile from './NavItems/YourProfile';

const SignedUser: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const [openMenu, setOpenMenu] = useState(false);
  const setShowMobileDrawer = useGlobalModalStateStore(
    (state) => state.setShowMobileDrawer
  );
  const showMobileDrawer = useGlobalModalStateStore(
    (state) => state.showMobileDrawer
  );

  const Avatar = () => (
    <Image
      alt={currentProfile?.id}
      className="size-8 cursor-pointer rounded-full border dark:border-gray-700"
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
      <DropdownMenu.Root
        modal={false}
        onOpenChange={setOpenMenu}
        open={openMenu}
      >
        <div className="hidden md:block">
          <DropdownMenu.Trigger asChild>
            <button className="outline-brand-500 flex self-center rounded-full">
              <Avatar />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            align="end"
            className="radix-transition absolute right-0 mt-2 w-48 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-black"
          >
            <DropdownMenu.Item asChild>
              <NextLink
                className="m-2 flex items-center rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-800"
                href={getProfile(currentProfile).link}
                onClick={() => setOpenMenu(false)}
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
              </NextLink>
            </DropdownMenu.Item>
            <div className="divider" />
            <DropdownMenu.Item className="m-2 rounded-lg border focus:outline-none data-[highlighted]:bg-gray-100 dark:border-gray-700 dark:data-[highlighted]:bg-gray-800">
              <SwitchProfile />
            </DropdownMenu.Item>
            <div className="divider" />
            <DropdownMenu.Item asChild>
              <NextLink
                className="menu-item focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800"
                href={getProfile(currentProfile).link}
                onClick={() => setOpenMenu(false)}
              >
                <YourProfile />
              </NextLink>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <NextLink
                className="menu-item focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800"
                href="/settings"
                onClick={() => setOpenMenu(false)}
              >
                <Settings />
              </NextLink>
            </DropdownMenu.Item>
            {isFeatureEnabled(FeatureFlag.Gardener) ||
            isFeatureEnabled(FeatureFlag.TrustedProfile) ? (
              <DropdownMenu.Item asChild>
                <NextLink
                  className="menu-item focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800"
                  href="/mod"
                  onClick={() => setOpenMenu(false)}
                >
                  <Mod />
                </NextLink>
              </DropdownMenu.Item>
            ) : null}
            <DropdownMenu.Item className="m-2 rounded-lg focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800">
              <Invites />
            </DropdownMenu.Item>

            {isFeatureEnabled('pro') && (
              <DropdownMenu.Item asChild>
                <NextLink
                  className="menu-item focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800"
                  href="/pro"
                  onClick={() => setOpenMenu(false)}
                >
                  <Pro />
                </NextLink>
              </DropdownMenu.Item>
            )}

            <DropdownMenu.Item className="m-2 rounded-lg focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800">
              <Logout />
            </DropdownMenu.Item>
            <div className="divider" />
            <DropdownMenu.Item className="m-2 rounded-lg focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800">
              <ThemeSwitch />
            </DropdownMenu.Item>
            {isFeatureEnabled(FeatureFlag.Gardener) ? (
              <DropdownMenu.Item className="m-2 rounded-lg focus:outline-none data-[highlighted]:bg-yellow-100 dark:data-[highlighted]:bg-yellow-800">
                <GardenerMode />
              </DropdownMenu.Item>
            ) : null}
            {isFeatureEnabled(FeatureFlag.Staff) ? (
              <DropdownMenu.Item className="m-2 rounded-lg focus:outline-none data-[highlighted]:bg-yellow-100 dark:data-[highlighted]:bg-yellow-800">
                <StaffMode />
              </DropdownMenu.Item>
            ) : null}
            <div className="divider" />
            <AppVersion />
          </DropdownMenu.Content>
        </div>
      </DropdownMenu.Root>
    </>
  );
};

export default SignedUser;
