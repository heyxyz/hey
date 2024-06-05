import type { FC } from 'react';

import { HeyLensSignup } from '@hey/abis';
import { HEY_LENS_SIGNUP } from '@hey/data/constants';
import { NumberedStat } from '@hey/ui';
import { useReadContract } from 'wagmi';

const ProfilesCreated: FC = () => {
  const { data: totalProfilesCreated } = useReadContract({
    abi: HeyLensSignup,
    address: HEY_LENS_SIGNUP,
    functionName: 'totalProfilesCreated',
    query: { refetchInterval: 2000 }
  });

  const { data: profilesCreatedViaCrypto } = useReadContract({
    abi: HeyLensSignup,
    address: HEY_LENS_SIGNUP,
    functionName: 'profilesCreatedViaCrypto',
    query: { refetchInterval: 2000 }
  });

  const { data: profilesCreatedViaCard } = useReadContract({
    abi: HeyLensSignup,
    address: HEY_LENS_SIGNUP,
    functionName: 'profilesCreatedViaCard',
    query: { refetchInterval: 2000 }
  });

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <NumberedStat
        count={totalProfilesCreated?.toString() || '0'}
        name={`Total Profiles`}
        suffix="Profiles"
      />
      <NumberedStat
        count={profilesCreatedViaCrypto?.toString() || '0'}
        name={`Via Crypto`}
        suffix="Profiles"
      />
      <NumberedStat
        count={profilesCreatedViaCard?.toString() || '0'}
        name={`Via Card`}
        suffix="Profiles"
      />
    </div>
  );
};

export default ProfilesCreated;
