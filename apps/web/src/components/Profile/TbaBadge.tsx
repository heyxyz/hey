import type { FC } from 'react';

import { STATIC_IMAGES_URL } from '@hey/data/constants';
import getTbaStatus from '@hey/lib/api/getTbaStatus';
import { Tooltip } from '@hey/ui';
import isFeatureAvailable from '@lib/isFeatureAvailable';
import { useQuery } from '@tanstack/react-query';

interface TbaBadgeProps {
  address: string;
}

const TbaBadge: FC<TbaBadgeProps> = ({ address }) => {
  const { data: isTba } = useQuery({
    queryFn: () => getTbaStatus(address),
    queryKey: ['getTbaStatus', address]
  });

  if (!isTba) {
    return null;
  }

  if (!isFeatureAvailable('tba')) {
    return null;
  }

  return (
    <Tooltip content="Token Bounded Account">
      <img
        alt="Token Bounded Account"
        className="size-6"
        height={24}
        src={`${STATIC_IMAGES_URL}/brands/tba.svg`}
        width={24}
      />
    </Tooltip>
  );
};

export default TbaBadge;
