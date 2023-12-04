import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import Sidebar from '@components/Shared/Sidebar';
import UserProfile from '@components/Shared/UserProfile';
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
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useAccount } from 'wagmi';

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
            icon: <UserIcon className="h-4 w-4" />,
            title: 'Profile',
            url: '/settings'
          },
          {
            icon: <CpuChipIcon className="h-4 w-4" />,
            title: 'Account',
            url: '/settings/account'
          },
          {
            icon: <AtSymbolIcon className="h-4 w-4" />,
            title: 'Handles',
            url: '/settings/handles'
          },
          {
            icon: <AdjustmentsVerticalIcon className="h-4 w-4" />,
            title: 'Preferences',
            url: '/settings/preferences'
          },
          {
            icon: <BookmarkIcon className="h-4 w-4" />,
            title: 'Interests',
            url: '/settings/interests'
          },
          {
            enabled,
            icon: <FingerPrintIcon className="h-4 w-4" />,
            title: 'Manager',
            url: '/settings/manager'
          },
          {
            icon: <ShareIcon className="h-4 w-4" />,
            title: 'Allowance',
            url: '/settings/allowance'
          },
          {
            icon: <GlobeAltIcon className="h-4 w-4" />,
            title: 'Sessions',
            url: '/settings/sessions'
          },
          {
            icon: <QueueListIcon className="h-4 w-4" />,
            title: 'Action History',
            url: '/settings/actions'
          },
          {
            icon: <NoSymbolIcon className="h-4 w-4" />,
            title: 'Blocked Profiles',
            url: '/settings/blocked'
          },
          {
            icon: <SparklesIcon className="h-4 w-4" />,
            title: 'Cleanup',
            url: '/settings/cleanup'
          },
          {
            icon: <CircleStackIcon className="h-4 w-4" />,
            title: 'Export',
            url: '/settings/export'
          },
          {
            enabled,
            icon: <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />,
            title: <div className="text-red-500">Danger zone</div>,
            url: '/settings/danger'
          }
        ]}
      />
    </div>
  );
};

export default SettingsSidebar;
