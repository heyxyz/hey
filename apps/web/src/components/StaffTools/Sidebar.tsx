import Sidebar from '@components/Shared/Sidebar';
import { ChartPieIcon, QueueListIcon } from '@heroicons/react/24/outline';
import { t } from '@lingui/macro';
import type { FC } from 'react';

const StaffToolsSidebar: FC = () => {
  return (
    <Sidebar
      items={[
        {
          title: t`Stats`,
          icon: <ChartPieIcon className="h-4 w-4" />,
          url: '/stafftools'
        },
        {
          title: t`Relay queues`,
          icon: <QueueListIcon className="h-4 w-4" />,
          url: '/stafftools/relayqueues'
        }
      ]}
    />
  );
};

export default StaffToolsSidebar;
