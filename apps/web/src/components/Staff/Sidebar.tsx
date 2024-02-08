import type { FC } from 'react';

import Sidebar from '@components/Shared/Sidebar';
import {
  AdjustmentsHorizontalIcon,
  ClipboardIcon,
  CurrencyDollarIcon,
  NoSymbolIcon,
  UserIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

const settingsSidebarItems = [
  {
    icon: <ClipboardIcon className="size-4" />,
    title: 'Overview',
    url: '/staff'
  },
  {
    icon: <UserIcon className="size-4" />,
    title: 'Users',
    url: '/staff/users'
  },
  {
    icon: <CurrencyDollarIcon className="size-4" />,
    title: 'Tokens',
    url: '/staff/tokens'
  },
  {
    icon: <AdjustmentsHorizontalIcon className="size-4" />,
    title: 'Feature flags',
    url: '/staff/feature-flags'
  },
  {
    icon: <NoSymbolIcon className="size-4" />,
    title: 'Kill switches',
    url: '/staff/kill-switches'
  },
  {
    icon: <UserPlusIcon className="size-4" />,
    title: 'Signup contract',
    url: '/staff/signup-contract'
  }
];

const StaffSidebar: FC = () => {
  return (
    <div className="mb-4 px-3 sm:px-0">
      <Sidebar items={settingsSidebarItems} />
    </div>
  );
};

export default StaffSidebar;
