import {
  AdjustmentsVerticalIcon,
  AtSymbolIcon,
  BookmarkIcon,
  CircleStackIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
  FingerPrintIcon,
  GlobeAltIcon,
  NoSymbolIcon,
  QueueListIcon,
  ShareIcon,
  SparklesIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import type { Profile } from '@hey/lens';
import type { FC } from 'react';
import { useAccount } from 'wagmi';

import Sidebar from '@/components/Shared/Sidebar';
import UserProfile from '@/components/Shared/UserProfile';
import useProfileStore from '@/store/persisted/useProfileStore';

const SettingsSidebar: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const { address } = useAccount();
  const enabled = currentProfile?.ownedBy.address === address;

  return (
    <div className="mb-4 px-3 sm:px-0">
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
            title: 'Handles',
            icon: <AtSymbolIcon className="h-4 w-4" />,
            url: '/settings/handles'
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
            title: 'Manager',
            icon: <FingerPrintIcon className="h-4 w-4" />,
            url: '/settings/manager',
            enabled
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
            title: 'Action History',
            icon: <QueueListIcon className="h-4 w-4" />,
            url: '/settings/actions'
          },
          {
            title: 'Blocked Profiles',
            icon: <NoSymbolIcon className="h-4 w-4" />,
            url: '/settings/blocked'
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
            url: '/settings/danger',
            enabled
          }
        ]}
      />
    </div>
  );
};

export default SettingsSidebar;
