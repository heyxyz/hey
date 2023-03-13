import type { FC } from 'react';

import NftShimmer from './NftShimmer';

const NftsShimmer: FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <NftShimmer />
      <NftShimmer />
      <NftShimmer />
      <NftShimmer />
    </div>
  );
};

export default NftsShimmer;
