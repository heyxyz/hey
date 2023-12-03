import {
  AdjustmentsHorizontalIcon,
  ClipboardIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  UserIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import type { FC } from 'react';

import Sidebar from '@/components/Shared/Sidebar';

const StaffSidebar: FC = () => {
  return (
    <div className="mb-4 px-3 sm:px-0">
      <Sidebar
        items={[
          {
            title: 'Overview 🚧',
            icon: <ClipboardIcon className="h-4 w-4" />,
            url: '/staff'
          },
          {
            title: 'Users',
            icon: <UserIcon className="h-4 w-4" />,
            url: '/staff/users'
          },
          {
            title: 'Groups 🚧',
            icon: <UsersIcon className="h-4 w-4" />,
            url: '/staff/groups'
          },
          {
            title: 'Tokens',
            icon: <CurrencyDollarIcon className="h-4 w-4" />,
            url: '/staff/tokens'
          },
          {
            title: 'Feature flags',
            icon: <AdjustmentsHorizontalIcon className="h-4 w-4" />,
            url: '/staff/feature-flags'
          },
          {
            title: 'Abuse 🚧',
            icon: <ExclamationTriangleIcon className="h-4 w-4" />,
            url: '/staff/abuse'
          }
        ]}
      />
    </div>
  );
};

export default StaffSidebar;
