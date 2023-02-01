import Sidebar from '@components/Shared/Sidebar';
import { ChartPieIcon } from '@heroicons/react/outline';
import type { FC } from 'react';

const StaffToolsSidebar: FC = () => {
  return (
    <Sidebar
      items={[
        {
          title: 'Stats',
          icon: <ChartPieIcon className="h-4 w-4" />,
          url: '/stafftools'
        }
      ]}
    />
  );
};

export default StaffToolsSidebar;
