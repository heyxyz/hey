import type { FC } from 'react';

import { SparklesIcon } from '@heroicons/react/24/solid';
import getProStatus from '@hey/lib/api/getProStatus';
import { Tooltip } from '@hey/ui';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { useQuery } from '@tanstack/react-query';

interface ProBadgeProps {
  id: string;
}

const ProBadge: FC<ProBadgeProps> = ({ id }) => {
  const { data } = useQuery({
    queryFn: () => getProStatus(id),
    queryKey: ['getProStatus', id]
  });

  console.log('ProBadge', data);

  if (!data) {
    return null;
  }

  const { isBeliever, isPro } = data;

  if (!isFeatureEnabled('pro')) {
    return null;
  }

  if (isBeliever) {
    return (
      <Tooltip content="Believer">
        <div className="flex size-5 items-center justify-center rounded-md bg-yellow-500">
          <SparklesIcon className="size-3 text-white" />
        </div>
      </Tooltip>
    );
  }

  if (isPro) {
    return (
      <Tooltip content="Pro">
        <div className="flex size-5 items-center justify-center rounded-md bg-green-500">
          <SparklesIcon className="size-3 text-white" />
        </div>
      </Tooltip>
    );
  }

  return null;
};

export default ProBadge;
