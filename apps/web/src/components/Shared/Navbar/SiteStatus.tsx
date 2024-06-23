import type { FC } from 'react';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const SiteStatus: FC = () => {
  const getSiteStatus = async () => {
    try {
      const response = await axios.get('https://status.heyxyz.workers.dev');
      const data = response.data as {
        data: { attributes: { status: 'down' } }[];
      };

      const isAnyServiceDown = data.data.some(
        (monitor) => monitor.attributes.status === 'down'
      );

      return isAnyServiceDown;
    } catch {
      return false;
    }
  };

  const { data: isAnyServiceDown, isLoading } = useQuery({
    queryFn: getSiteStatus,
    queryKey: ['getSiteStatus'],
    refetchInterval: 20000
  });

  if (isLoading || !isAnyServiceDown) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2 border-b border-b-yellow-500 bg-yellow-200 px-3 py-2 text-sm dark:bg-yellow-800">
      <ExclamationTriangleIcon className="mt-1 h-4 w-4" />
      <div>
        Some services are temporarily unavailable at the moment. We are working
        on it.
      </div>
    </div>
  );
};

export default SiteStatus;
