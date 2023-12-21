import type { FC } from 'react';

import Sidebar from '@components/Shared/Sidebar';
import {
  AdjustmentsHorizontalIcon,
  ClipboardIcon,
  CurrencyDollarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const StaffSidebar: FC = () => {
  return (
    <div className="mb-4 px-3 sm:px-0">
      <Sidebar
        items={[
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
        ]}
      />
    </div>
  );
};

export default StaffSidebar;
