import useStaffMode from '@components/utils/hooks/useStaffMode';
import { useDisconnectXmtp } from '@components/utils/hooks/useXmtpClient';
import { Menu } from '@headlessui/react';
import {
  CheckCircleIcon,
  EmojiHappyIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  SwitchHorizontalIcon
} from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import formatHandle from '@lib/formatHandle';
import getAttribute from '@lib/getAttribute';
import getAvatar from '@lib/getAvatar';
import isGardener from '@lib/isGardener';
import isStaff from '@lib/isStaff';
import resetAuthData from '@lib/resetAuthData';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import { APP_VERSION } from 'data/constants';
import type { Profile } from 'lens';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { Fragment } from 'react';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import { PROFILE, STAFFTOOLS } from 'src/tracking';
import { useDisconnect } from 'wagmi';

import MenuTransition from '../MenuTransition';
import Slug from '../Slug';
import { NextLink } from './MenuItems';
import Logout from './NavItems/Logout';
import Mod from './NavItems/Mod';
import Settings from './NavItems/Settings';
import ThemeSwitch from './NavItems/ThemeSwitch';
import YourProfile from './NavItems/YourProfile';

const SignedUser: FC = () => {
  const router = useRouter();
  const profiles = useAppStore((state) => state.profiles);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const setStaffMode = useAppPersistStore((state) => state.setStaffMode);
  const setShowStatusModal = useGlobalModalStateStore((state) => state.setShowStatusModal);
  const { allowed: staffMode } = useStaffMode();
  const { disconnect } = useDisconnect();
  const disconnectXmtp = useDisconnectXmtp();

  const statusEmoji = getAttribute(currentProfile?.attributes, 'statusEmoji');
  const statusMessage = getAttribute(currentProfile?.attributes, 'statusMessage');
  const hasStatus = statusEmoji && statusMessage;

  const toggleStaffMode = () => {
    setStaffMode(!staffMode);
    Analytics.track(STAFFTOOLS.TOGGLE_MODE);
  };

  const logout = () => {
    Analytics.track(PROFILE.LOGOUT);
    disconnectXmtp();
    setCurrentProfile(null);
    setProfileId(null);
    resetAuthData();
    disconnect?.();
    router.push('/');
  };

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
              as="a"
              onClick={() => setShowStatusModal(true)}
              className={({ active }: { active: boolean }) =>
                clsx({ 'dropdown-active': active }, 'menu-item border dark:border-gray-700')
              }
            >
              <div className="flex items-center space-x-2">
                {hasStatus ? (
                  <>
                    <span>{statusEmoji}</span>
                    <span className="truncate">{statusMessage}</span>
                  </>
                ) : (
                  <>
                    <EmojiHappyIcon className="w-4 h-4" />
                    <span>
                      <Trans>Set status</Trans>
                    </span>
                  </>
                )}
              </div>
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
              <Logout onClick={() => logout()} />
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
                <div className="py-3 px-6 text-xs">
                  <a
                    href={`https://github.com/lensterxyz/lenster/releases/tag/v${APP_VERSION}`}
                    className="font-mono"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    v{APP_VERSION}
                  </a>
                </div>
              </>
            )}
            {isStaff(currentProfile?.id) && (
              <>
                <div className="divider" />
                <Menu.Item
                  as="div"
                  onClick={toggleStaffMode}
                  className={({ active }) =>
                    clsx({ 'bg-yellow-100 dark:bg-yellow-800': active }, 'menu-item')
                  }
                >
                  {staffMode ? (
                    <div className="flex items-center space-x-1.5">
                      <div>
                        <Trans>Disable staff mode</Trans>
                      </div>
                      <ShieldExclamationIcon className="w-4 h-4 text-green-600" />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5">
                      <div>
                        <Trans>Enable staff mode</Trans>
                      </div>
                      <ShieldCheckIcon className="w-4 h-4 text-red-500" />
                    </div>
                  )}
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
