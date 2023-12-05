import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { STATIC_IMAGES_URL } from '@hey/data/constants';
import getTbaStatus from '@hey/lib/api/getTbaStatus';
import { Tooltip } from '@hey/ui';
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

  return (
    <Tooltip content="Token Bonded Account">
      <img
        alt="Token Bonded Account"
        className="h-6 w-6"
        height={24}
        src={`${STATIC_IMAGES_URL}/brands/tba.svg`}
        width={24}
      />
    </Tooltip>
  );
};

export default TbaBadge;
