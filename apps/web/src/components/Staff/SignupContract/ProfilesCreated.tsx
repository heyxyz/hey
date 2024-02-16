import type { FC } from 'react';

import { HeyLensSignup } from '@hey/abis';
import { HEY_LENS_SIGNUP } from '@hey/data/constants';
import { useReadContract } from 'wagmi';

import NumberedStat from '../UI/NumberedStat';

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
    <>
      <NumberedStat
        count={totalProfilesCreated?.toString() || '0'}
        name={`Total Profiles Created`}
        suffix="Profiles"
      />
      <NumberedStat
        count={profilesCreatedViaCrypto?.toString() || '0'}
        name={`Profiles Created via Crypto`}
        suffix="Profiles via Crypto"
      />
      <NumberedStat
        count={profilesCreatedViaCard?.toString() || '0'}
        name={`Profiles Created via Card`}
        suffix="Profiles via Card"
      />
    </>
  );
};

export default ProfilesCreated;
