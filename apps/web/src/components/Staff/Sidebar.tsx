import type { FC } from 'react';

import Sidebar from '@components/Shared/Sidebar';
import SidebarMenu from '@components/Shared/SidebarMenu';
import {
  AdjustmentsHorizontalIcon,
  ClipboardIcon,
  CurrencyDollarIcon,
  UserIcon
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
  }
];

const StaffSidebar: FC = () => {
  return (
    <div className="mb-4 px-3 sm:px-0">
      <div className="hidden lg:block">
        <Sidebar items={settingsSidebarItems} />
      </div>
      <div className="block lg:hidden">
        <SidebarMenu items={settingsSidebarItems} />
      </div>
    </div>
  );
};

export default StaffSidebar;
