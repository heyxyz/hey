import Sidebar from '@components/Shared/Sidebar';
import { ChartPieIcon } from '@heroicons/react/outline';
import type { FC } from 'react';

const StaffToolsSidebar: FC = () => {
  return (
    <Sidebar
      items={[
        {
          title: 'Stats',
          icon: <ChartPieIcon className="w-4 h-4" />,
          url: '/stafftools'
        }
      ]}
    />
  );
};

export default StaffToolsSidebar;
