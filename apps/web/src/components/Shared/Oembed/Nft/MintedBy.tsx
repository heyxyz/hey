import type { Profile } from '@hey/lens';
import type { FC } from 'react';
import type { Address } from 'viem';

import SmallUserProfile from '@components/Shared/SmallUserProfile';
import { useDefaultProfileQuery } from '@hey/lens';

interface MintedByProps {
  address: Address;
}

const MintedBy: FC<MintedByProps> = ({ address }) => {
  const { data, loading } = useDefaultProfileQuery({
    skip: !address,
    variables: { request: { for: address } }
  });

  if (!address && loading) {
    return null;
  }

  if (!data?.defaultProfile) {
    return null;
  }

  return (
    <div className="absolute left-3 top-3 rounded-lg bg-gray-950/70 px-2 py-1 text-sm text-white">
      <SmallUserProfile
        hideSlug
        linkToProfile
        profile={data.defaultProfile as Profile}
        smallAvatar
      />
    </div>
  );
};

export default MintedBy;
