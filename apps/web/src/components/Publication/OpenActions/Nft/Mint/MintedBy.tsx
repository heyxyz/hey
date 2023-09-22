import SmallUserProfileShimmer from '@components/Shared/Shimmer/SmallUserProfileShimmer';
import SmallUserProfile from '@components/Shared/SmallUserProfile';
import SmallWalletProfile from '@components/Shared/SmallWalletProfile';
import type { Profile } from '@lenster/lens';
import { useProfilesManagedQuery } from '@lenster/lens';
import { type FC } from 'react';
import type { Address } from 'viem';

interface MintedByProps {
  address: Address;
}

const MintedBy: FC<MintedByProps> = ({ address }) => {
  const { data, loading } = useProfilesManagedQuery({
    variables: { request: { for: address } },
    skip: !Boolean(address)
  });

  const profile = data?.profilesManaged.items[0];

  if (!address) {
    return null;
  }

  return (
    <div className="mb-4 flex items-center gap-x-2">
      <span>by</span>
      {loading ? (
        <SmallUserProfileShimmer smallAvatar />
      ) : profile ? (
        <SmallUserProfile profile={profile as Profile} smallAvatar />
      ) : (
        <SmallWalletProfile address={address} smallAvatar />
      )}
    </div>
  );
};

export default MintedBy;
