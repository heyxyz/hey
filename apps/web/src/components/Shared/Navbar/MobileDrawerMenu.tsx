import { CheckCircleIcon, EmojiHappyIcon, SwitchHorizontalIcon, XIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import formatHandle from '@lib/formatHandle';
import getAttribute from '@lib/getAttribute';
import getAvatar from '@lib/getAvatar';
import isGardener from '@lib/isGardener';
import { Trans } from '@lingui/macro';
import { APP_VERSION } from 'data/constants';
import type { Profile } from 'lens';
import Link from 'next/link';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import { PROFILE } from 'src/tracking';

import Slug from '../Slug';
import Contact from './NavItems/Contact';
import Logout from './NavItems/Logout';
import Mod from './NavItems/Mod';
import ReportBug from './NavItems/ReportBug';
import Settings from './NavItems/Settings';
import ThemeSwitch from './NavItems/ThemeSwitch';
import YourProfile from './NavItems/YourProfile';

const MobileDrawerMenu = () => {
  const profiles = useAppStore((state) => state.profiles);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowStatusModal = useGlobalModalStateStore((state) => state.setShowStatusModal);

  const statusEmoji = getAttribute(currentProfile?.attributes, 'statusEmoji');
  const statusMessage = getAttribute(currentProfile?.attributes, 'statusMessage');
  const hasStatus = statusEmoji && statusMessage;

  const closeDrawer = () => {
    document.getElementById('mobile-drawer')?.classList.add('hidden');
  };

  return (
    <div
      id="mobile-drawer"
      className="w-full z-[10] hidden overflow-y-auto no-scrollbar bottom-0 top-0 h-full bg-gray-100 dark:bg-black py-4 md:hidden fixed"
    >
      <button className="visible md:hidden px-5" type="button" onClick={closeDrawer}>
        <XIcon className="w-6 h-6" />
      </button>
      <div className="w-full py-4 space-y-4">
        <Link
          href={`/u/${formatHandle(currentProfile?.handle)}`}
          className="flex px-5 space-x-2 items-center"
        >
          <img
            src={getAvatar(currentProfile as Profile)}
            className="w-12 h-12 rounded-full border cursor-pointer dark:border-gray-700"
            alt={formatHandle(currentProfile?.handle)}
          />
          <div>
            <div>
              <Trans>Logged in as</Trans>
            </div>
            <div className="truncate">
              <Slug className="font-bold" slug={formatHandle(currentProfile?.handle)} prefix="@" />
            </div>
          </div>
        </Link>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <button type="button" className="py-4 px-5 w-full" onClick={() => setShowStatusModal(true)}>
            <div className="flex items-center space-x-2">
              {hasStatus ? (
                <>
                  <span>{statusEmoji}</span>
                  <span className="truncate">{statusMessage}</span>
                </>
              ) : (
                <>
                  <EmojiHappyIcon className="w-5 h-5" />
                  <span>
                    <Trans>Set status</Trans>
                  </span>
                </>
              )}
            </div>
          </button>
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <div className="mx-5 my-2">
            <YourProfile onClick={() => closeDrawer()} className="py-4" />
            <Settings onClick={() => closeDrawer()} className="py-4" />
            {isGardener(currentProfile?.id) && <Mod onClick={() => closeDrawer()} className="py-4" />}
            <ThemeSwitch className="py-4" onClick={() => closeDrawer()} />
            <div className="flex flex-col py-4">
              <div className="flex items-center space-x-1.5">
                <SwitchHorizontalIcon className="w-4 h-4" />
                <div>
                  <Trans>Switch to</Trans>
                </div>
              </div>
              <div className="pt-3 px-4">
                {profiles.map((profile: Profile, index) => (
                  <div
                    key={profile?.id}
                    className="block w-full text-gray-700 rounded-lg cursor-pointer dark:text-gray-200"
                  >
                    <button
                      type="button"
                      className="flex items-center py-1 space-x-2 w-full rounded-lg"
                      onClick={() => {
                        const selectedProfile = profiles[index];
                        setCurrentProfile(selectedProfile);
                        setProfileId(selectedProfile.id);
                        Analytics.track(PROFILE.SWITCH_PROFILE);
                      }}
                    >
                      <span className="flex items-center py-1 space-x-2 w-full rounded-lg">
                        <img
                          className="w-5 h-5 rounded-full border dark:border-gray-700"
                          height={20}
                          width={20}
                          src={getAvatar(profile)}
                          alt={formatHandle(profile?.handle)}
                        />
                        <div className="truncate">{formatHandle(profile?.handle)}</div>
                      </span>
                      {currentProfile?.id === profile?.id && (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <div className="mx-5 my-2">
            <Contact className="py-4" onClick={() => closeDrawer()} />
            <ReportBug className="py-4" onClick={() => closeDrawer()} />
          </div>
          <div className="divider" />
        </div>

        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <Logout className="p-5" onClick={() => closeDrawer()} />
          <div className="divider" />
        </div>

        {currentProfile && (
          <div className="py-2 px-5 text-sm opacity-60">
            <Link
              href={`https://github.com/lensterxyz/lenster/releases/tag/v${APP_VERSION}`}
              className="font-mono"
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => closeDrawer()}
            >
              v{APP_VERSION}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileDrawerMenu;
