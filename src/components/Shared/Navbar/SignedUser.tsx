import { Tooltip } from '@components/UI/Tooltip';
import { Profile } from '@generated/types';
import { Menu, Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  CogIcon,
  LogoutIcon,
  MoonIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  SunIcon,
  SwitchHorizontalIcon,
  UserIcon
} from '@heroicons/react/outline';
import getAvatar from '@lib/getAvatar';
import isBeta from '@lib/isBeta';
import isStaff from '@lib/isStaff';
import { Mixpanel } from '@lib/mixpanel';
import resetAuthData from '@lib/resetAuthData';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { FC, Fragment } from 'react';
import { GIT_COMMIT_SHA } from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { PROFILE, STAFFTOOLS, SYSTEM } from 'src/tracking';
import { useDisconnect } from 'wagmi';

import Slug from '../Slug';
import { NextLink } from './MenuItems';

interface Props {
  pingData: {
    ping: string;
  };
}

const SignedUser: FC<Props> = ({ pingData }) => {
  const profiles = useAppStore((state) => state.profiles);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const staffMode = useAppPersistStore((state) => state.staffMode);
  const setStaffMode = useAppPersistStore((state) => state.setStaffMode);
  const { theme, setTheme } = useTheme();
  const { disconnect } = useDisconnect();

  const toggleStaffMode = () => {
    setStaffMode(!staffMode);
    Mixpanel.track(STAFFTOOLS.TOGGLE_MODE);
  };

  return (
    <Menu as="div">
      {({ open }) => (
        <>
          <Menu.Button
            as="img"
            src={getAvatar(currentProfile as Profile)}
            className="w-8 h-8 rounded-full border cursor-pointer dark:border-gray-700/80"
            alt={currentProfile?.handle}
          />
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="absolute right-0 py-1 mt-2 w-48 bg-white rounded-xl border shadow-sm dark:bg-gray-900 focus:outline-none dark:border-gray-700/80"
            >
              <Menu.Item
                as={NextLink}
                href={`/u/${currentProfile?.handle}`}
                className={({ active }: { active: boolean }) =>
                  clsx({ 'dropdown-active': active }, 'menu-item')
                }
              >
                <div>Logged in as</div>
                <div className="truncate">
                  <Slug className="font-bold" slug={currentProfile?.handle} prefix="@" />
                </div>
              </Menu.Item>
              <div className="divider" />
              <Menu.Item
                as={NextLink}
                href={`/u/${currentProfile?.handle}`}
                className={({ active }: { active: boolean }) =>
                  clsx({ 'dropdown-active': active }, 'menu-item')
                }
              >
                <div className="flex items-center space-x-1.5">
                  <UserIcon className="w-4 h-4" />
                  <div>Your Profile</div>
                </div>
              </Menu.Item>
              <Menu.Item
                as={NextLink}
                href="/settings"
                className={({ active }: { active: boolean }) =>
                  clsx({ 'dropdown-active': active }, 'menu-item')
                }
              >
                <div className="flex items-center space-x-1.5">
                  <CogIcon className="w-4 h-4" />
                  <div>Settings</div>
                </div>
              </Menu.Item>
              <Menu.Item
                as="a"
                onClick={() => {
                  Mixpanel.track(PROFILE.LOGOUT);
                  setCurrentProfile(null);
                  setProfileId(null);
                  resetAuthData();
                  disconnect?.();
                }}
                className={({ active }: { active: boolean }) =>
                  clsx({ 'dropdown-active': active }, 'menu-item')
                }
              >
                <div className="flex items-center space-x-1.5">
                  <LogoutIcon className="w-4 h-4" />
                  <div>Logout</div>
                </div>
              </Menu.Item>
              {profiles?.length > 1 && (
                <>
                  <div className="divider" />
                  <div className="overflow-auto m-2 max-h-36 no-scrollbar">
                    <div className="flex items-center px-4 pt-1 pb-2 space-x-1.5 text-sm font-bold text-gray-500">
                      <SwitchHorizontalIcon className="w-4 h-4" />
                      <div>Switch to</div>
                    </div>
                    {profiles.map((profile: Profile, index: number) => (
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
                            Mixpanel.track(PROFILE.SWITCH_PROFILE);
                          }}
                        >
                          {currentProfile?.id === profile?.id && (
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          )}
                          <img
                            className="w-5 h-5 rounded-full border dark:border-gray-700/80"
                            height={20}
                            width={20}
                            src={getAvatar(profile)}
                            alt={profile?.handle}
                          />
                          <div className="truncate">{profile?.handle}</div>
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div className="divider" />
              <Menu.Item
                as="a"
                onClick={() => {
                  setTheme(theme === 'light' ? 'dark' : 'light');
                  Mixpanel.track(theme === 'light' ? SYSTEM.SWITCH_DARK_THEME : SYSTEM.SWITCH_LIGHT_THEME);
                }}
                className={({ active }: { active: boolean }) =>
                  clsx({ 'dropdown-active': active }, 'menu-item')
                }
              >
                <div className="flex items-center space-x-1.5">
                  {theme === 'light' ? (
                    <>
                      <MoonIcon className="w-4 h-4" />
                      <div>Dark mode</div>
                    </>
                  ) : (
                    <>
                      <SunIcon className="w-4 h-4" />
                      <div>Light mode</div>
                    </>
                  )}
                </div>
              </Menu.Item>
              {currentProfile && GIT_COMMIT_SHA && (
                <>
                  <div className="divider" />
                  <div className="py-3 px-6 text-xs flex items-center space-x-2">
                    {pingData && (
                      <Tooltip content="Indexer Status" placement="top">
                        <div
                          className={clsx(
                            { 'bg-green-500': pingData?.ping === 'pong' },
                            { 'bg-red-500': pingData?.ping !== 'pong' },
                            'p-[4.5px] rounded-full animate-pulse'
                          )}
                        />
                      </Tooltip>
                    )}
                    <a
                      href={`https://github.com/lensterxyz/lenster/commit/${GIT_COMMIT_SHA}`}
                      className="font-mono"
                      title="Git commit SHA"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {GIT_COMMIT_SHA} {isBeta(currentProfile) && '(beta)'}
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
                    className={({ active }: { active: boolean }) =>
                      clsx({ 'bg-yellow-100 dark:bg-yellow-800': active }, 'menu-item')
                    }
                  >
                    {staffMode ? (
                      <div className="flex items-center space-x-1.5">
                        <div>Disable staff mode</div>
                        <ShieldExclamationIcon className="w-4 h-4 text-green-600" />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5">
                        <div>Enable staff mode</div>
                        <ShieldCheckIcon className="w-4 h-4 text-red-500" />
                      </div>
                    )}
                  </Menu.Item>
                </>
              )}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default SignedUser;
