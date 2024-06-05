import type { FC } from 'react';

import { PermissionlessCreator } from '@hey/abis';
import { HEY_LENS_SIGNUP, PERMISSIONLESS_CREATOR } from '@hey/data/constants';
import { NumberedStat } from '@hey/ui';
import { useReadContract } from 'wagmi';

const LensCredits: FC = () => {
  const { data } = useReadContract({
    abi: PermissionlessCreator,
    address: PERMISSIONLESS_CREATOR,
    args: [HEY_LENS_SIGNUP],
    functionName: 'getCreditBalance',
    query: { refetchInterval: 2000 }
  });

  const credits = data?.toString();

  return (
    <NumberedStat
      count={credits || '0'}
      name={`Lens Credits Balance`}
      suffix="Credits"
    />
  );
};

export default LensCredits;
