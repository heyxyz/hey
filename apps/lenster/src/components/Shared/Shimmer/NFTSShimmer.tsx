import { FC } from 'react';

import NFTShimmer from './NFTShimmer';

const NFTSShimmer: FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <NFTShimmer />
      <NFTShimmer />
      <NFTShimmer />
      <NFTShimmer />
    </div>
  );
};

export default NFTSShimmer;
