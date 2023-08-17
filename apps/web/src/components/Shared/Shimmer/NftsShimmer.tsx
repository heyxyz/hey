import type { FC } from 'react';

import NftShimmer from './NftShimmer';

const NftsShimmer: FC = () => {
  return (
    <div className="grid h-[fit-content] w-[100%] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      <NftShimmer />
      <NftShimmer />
      <NftShimmer />
      <NftShimmer />
      <NftShimmer />
      <NftShimmer />
      <NftShimmer />
      <NftShimmer />
    </div>
  );
};

export default NftsShimmer;
