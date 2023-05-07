'use client';
import React from 'react';

import NftShimmer from './NftShimmer';

const NftPickerShimmer = () => {
  return (
    <div className="m-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <NftShimmer />
      <NftShimmer />
      <NftShimmer />
      <NftShimmer />
      <NftShimmer />
      <NftShimmer />
    </div>
  );
};

export default NftPickerShimmer;
