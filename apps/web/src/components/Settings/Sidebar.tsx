import Sidebar from '@components/Shared/Sidebar';
import UserProfile from '@components/Shared/UserProfile';
import {
  AdjustmentsVerticalIcon,
  BookmarkIcon,
  CircleStackIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
  FingerPrintIcon,
  GlobeAltIcon,
  QueueListIcon,
  ShareIcon,
  SparklesIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import type { Profile } from '@hey/lens';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

const SettingsSidebar: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <div className="mb-4 space-y-1.5 px-3 sm:px-0">
      <div className="pb-3">
        <UserProfile
          profile={currentProfile as Profile}
          showUserPreview={false}
        />
      </div>
      <Sidebar
        items={[
          {
            title: 'Profile',
            icon: <UserIcon className="h-4 w-4" />,
            url: '/settings'
          },
          {
            title: 'Account',
            icon: <CpuChipIcon className="h-4 w-4" />,
            url: '/settings/account'
          },
          {
            title: 'Preferences',
            icon: <AdjustmentsVerticalIcon className="h-4 w-4" />,
            url: '/settings/preferences'
          },
          {
            title: 'Interests',
            icon: <BookmarkIcon className="h-4 w-4" />,
            url: '/settings/interests'
          },
          {
            title: 'Dispatcher',
            icon: <FingerPrintIcon className="h-4 w-4" />,
            url: '/settings/dispatcher'
          },
          {
            title: 'Allowance',
            icon: <ShareIcon className="h-4 w-4" />,
            url: '/settings/allowance'
          },
          {
            title: 'Sessions',
            icon: <GlobeAltIcon className="h-4 w-4" />,
            url: '/settings/sessions'
          },
          {
            title: 'Activity History',
            icon: <QueueListIcon className="h-4 w-4" />,
            url: '/settings/activities'
          },
          {
            title: 'Cleanup',
            icon: <SparklesIcon className="h-4 w-4" />,
            url: '/settings/cleanup'
          },
          {
            title: 'Export',
            icon: <CircleStackIcon className="h-4 w-4" />,
            url: '/settings/export'
          },
          {
            title: <div className="text-red-500">Danger zone</div>,
            icon: <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />,
            url: '/settings/danger'
          }
        ]}
      />
    </div>
  );
};

export default SettingsSidebar;
