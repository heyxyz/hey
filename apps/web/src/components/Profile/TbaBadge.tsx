import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { STATIC_IMAGES_URL } from '@hey/data/constants';
import getTbaStatus from '@hey/lib/api/getTbaStatus';
import { Tooltip } from '@hey/ui';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import { useQuery } from '@tanstack/react-query';

interface TbaBadgeProps {
  profile: Profile;
}

const TbaBadge: FC<TbaBadgeProps> = ({ profile }) => {
  const { data: isTba } = useQuery({
    queryFn: () => getTbaStatus(profile.ownedBy.address),
    queryKey: ['getTbaStatus', profile.ownedBy.address]
  });

  if (!isTba) {
    return null;
  }

  if (!isFeatureEnabled('tba')) {
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
