import type { Profile } from '@hey/lens';
import type { FC } from 'react';
import type { Address } from 'viem';

import SmallUserProfileShimmer from '@components/Shared/Shimmer/SmallUserProfileShimmer';
import SmallUserProfile from '@components/Shared/SmallUserProfile';
import SmallWalletProfile from '@components/Shared/SmallWalletProfile';
import { useDefaultProfileQuery } from '@hey/lens';

interface MintedByProps {
  address: Address;
}

const MintedBy: FC<MintedByProps> = ({ address }) => {
  const { data, loading } = useDefaultProfileQuery({
    skip: !address,
    variables: { request: { for: address } }
  });

  if (!address) {
    return null;
  }

  return (
    <div className="mb-4 flex items-center gap-x-2">
      <span>by</span>
      {loading ? (
        <SmallUserProfileShimmer smallAvatar />
      ) : data?.defaultProfile ? (
        <SmallUserProfile
          profile={data.defaultProfile as Profile}
          smallAvatar
        />
      ) : (
        <SmallWalletProfile address={address} smallAvatar />
      )}
    </div>
  );
};

export default MintedBy;
