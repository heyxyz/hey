import SmallWalletProfile from '@components/Shared/SmallWalletProfile';
import type { FC } from 'react';
import type { Address } from 'viem';

interface MintedByProps {
  address: Address;
}

const MintedBy: FC<MintedByProps> = ({ address }) => {
  if (!address) {
    return null;
  }

  // TODO: use default profile
  return (
    <div className="mb-4 flex items-center gap-x-2">
      <span>by</span>
      <SmallWalletProfile address={address} smallAvatar />
    </div>
  );
};

export default MintedBy;
