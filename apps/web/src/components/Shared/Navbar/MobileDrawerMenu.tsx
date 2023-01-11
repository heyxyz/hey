import { SwitchHorizontalIcon, XIcon } from '@heroicons/react/outline';
import formatHandle from '@lib/formatHandle';
import getAvatar from '@lib/getAvatar';
import isGardener from '@lib/isGardener';
import isStaff from '@lib/isStaff';
import { Trans } from '@lingui/macro';
import type { Profile } from 'lens';
import Link from 'next/link';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';

import Slug from '../Slug';
import AppVersion from './NavItems/AppVersion';
import Contact from './NavItems/Contact';
import Logout from './NavItems/Logout';
import Mod from './NavItems/Mod';
import ReportBug from './NavItems/ReportBug';
import Settings from './NavItems/Settings';
import StaffMode from './NavItems/StaffMode';
import Status from './NavItems/Status';
import ThemeSwitch from './NavItems/ThemeSwitch';
import YourProfile from './NavItems/YourProfile';

const MobileDrawerMenu = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowProfileSwitchModal = useGlobalModalStateStore((state) => state.setShowProfileSwitchModal);

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
          <div className="flex items-center space-x-2 w-full justify-between">
            <div className="flex space-x-1.5">
              <img
                src={getAvatar(currentProfile as Profile)}
                className="w-12 h-12 rounded-full border cursor-pointer dark:border-gray-700"
                alt={formatHandle(currentProfile?.handle)}
              />
              <div>
                <Trans>Logged in as</Trans>
                <div className="truncate">
                  <Slug className="font-bold" slug={formatHandle(currentProfile?.handle)} prefix="@" />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowProfileSwitchModal(true);
              }}
            >
              <SwitchHorizontalIcon className="w-4 h-4" />
            </button>
          </div>
        </Link>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <Status className="py-4 px-5" />
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <div className="mx-5 my-2">
            <YourProfile onClick={() => closeDrawer()} className="py-4" />
            <Settings onClick={() => closeDrawer()} className="py-4" />
            {isGardener(currentProfile?.id) && <Mod onClick={() => closeDrawer()} className="py-4" />}
            <ThemeSwitch className="py-4" onClick={() => closeDrawer()} />
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

        {currentProfile && <AppVersion />}
        {isStaff(currentProfile?.id) && (
          <div className="px-5">
            <StaffMode />
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileDrawerMenu;
