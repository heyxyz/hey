import SmallUserProfileShimmer from '@components/Shared/Shimmer/SmallUserProfileShimmer';
import SmallUserProfile from '@components/Shared/SmallUserProfile';
import SmallWalletProfile from '@components/Shared/SmallWalletProfile';
import type { Profile } from '@hey/lens';
import { useDefaultProfileQuery } from '@hey/lens';
import { type FC } from 'react';
import type { Address } from 'viem';

interface MintedByProps {
  address: Address;
}

const MintedBy: FC<MintedByProps> = ({ address }) => {
  const { data, loading } = useDefaultProfileQuery({
    variables: { request: { ethereumAddress: address } },
    skip: !Boolean(address)
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
        <SmallWalletProfile wallet={{ address }} smallAvatar />
      )}
    </div>
  );
};

export default MintedBy;
