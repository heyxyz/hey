import type { FC } from 'react';

import NftShimmer from './NftShimmers';

const NFTSShimmer: FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <NftShimmer />
      <NftShimmer />
      <NftShimmer />
      <NftShimmer />
    </div>
  );
};

export default NFTSShimmer;
