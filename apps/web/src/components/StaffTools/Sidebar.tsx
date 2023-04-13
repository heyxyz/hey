import Sidebar from '@components/Shared/Sidebar';
import { ChartPieIcon, ViewListIcon } from '@heroicons/react/outline';
import type { FC } from 'react';

const StaffToolsSidebar: FC = () => {
  return (
    <Sidebar
      items={[
        {
          title: 'Stats',
          icon: <ChartPieIcon className="h-4 w-4" />,
          url: '/stafftools'
        },
        {
          title: 'Relay queues',
          icon: <ViewListIcon className="h-4 w-4" />,
          url: '/stafftools/relayqueues'
        }
      ]}
    />
  );
};

export default StaffToolsSidebar;
