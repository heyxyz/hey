import Sidebar from '@components/Shared/Sidebar';
import UserProfile from '@components/Shared/UserProfile';
import {
  BookmarkIcon,
  ChipIcon,
  ExclamationIcon,
  FingerPrintIcon,
  ShareIcon,
  SparklesIcon,
  UserIcon
} from '@heroicons/react/outline';
import { t, Trans } from '@lingui/macro';
import type { Profile } from 'lens';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

const SettingsSidebar: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <div className="px-3 mb-4 space-y-1.5 sm:px-0">
      <div className="pb-3">
        <UserProfile profile={currentProfile as Profile} />
      </div>
      <Sidebar
        items={[
          {
            title: t`Profile`,
            icon: <UserIcon className="w-4 h-4" />,
            url: '/settings'
          },
          {
            title: t`Account`,
            icon: <ChipIcon className="w-4 h-4" />,
            url: '/settings/account'
          },
          {
            title: t`Interests`,
            icon: <BookmarkIcon className="w-4 h-4" />,
            url: '/settings/interests'
          },
          {
            title: t`Dispatcher`,
            icon: <FingerPrintIcon className="w-4 h-4" />,
            url: '/settings/dispatcher'
          },
          {
            title: t`Allowance`,
            icon: <ShareIcon className="w-4 h-4" />,
            url: '/settings/allowance'
          },
          {
            title: t`Cleanup`,
            icon: <SparklesIcon className="w-4 h-4" />,
            url: '/settings/cleanup'
          },
          {
            title: (
              <div className="text-red-500">
                <Trans>Danger Zone</Trans>
              </div>
            ),
            icon: <ExclamationIcon className="w-4 h-4 text-red-500" />,
            url: '/settings/delete'
          }
        ]}
      />
    </div>
  );
};

export default SettingsSidebar;
