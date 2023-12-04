import type { FC } from 'react';

import Sidebar from '@components/Shared/Sidebar';
import {
  AdjustmentsHorizontalIcon,
  ClipboardIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  UserIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const StaffSidebar: FC = () => {
  return (
    <div className="mb-4 px-3 sm:px-0">
      <Sidebar
        items={[
          {
            icon: <ClipboardIcon className="h-4 w-4" />,
            title: 'Overview',
            url: '/staff'
          },
          {
            icon: <UserIcon className="h-4 w-4" />,
            title: 'Users',
            url: '/staff/users'
          },
          {
            icon: <UsersIcon className="h-4 w-4" />,
            title: 'Groups 🚧',
            url: '/staff/groups'
          },
          {
            icon: <CurrencyDollarIcon className="h-4 w-4" />,
            title: 'Tokens',
            url: '/staff/tokens'
          },
          {
            icon: <AdjustmentsHorizontalIcon className="h-4 w-4" />,
            title: 'Feature flags',
            url: '/staff/feature-flags'
          },
          {
            icon: <ExclamationTriangleIcon className="h-4 w-4" />,
            title: 'Abuse 🚧',
            url: '/staff/abuse'
          }
        ]}
      />
    </div>
  );
};

export default StaffSidebar;
