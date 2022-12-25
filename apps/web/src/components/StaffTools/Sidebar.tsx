import Sidebar from '@components/Shared/Sidebar';
import { ChartBarIcon, ChartPieIcon } from '@heroicons/react/outline';
import type { FC } from 'react';

const StaffToolsSidebar: FC = () => {
  return (
    <div className="px-3 mb-4 space-y-1.5 sm:px-0">
      <Sidebar
        items={[
          {
            title: 'Stats',
            icon: <ChartPieIcon className="w-4 h-4" />,
            url: '/stafftools'
          },
          {
            title: 'Analytics',
            icon: <ChartBarIcon className="w-4 h-4" />,
            url: '/stafftools/analytics'
          }
        ]}
      />
    </div>
  );
};

export default StaffToolsSidebar;
