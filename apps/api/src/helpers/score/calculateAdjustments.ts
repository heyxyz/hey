import type { Address } from 'viem';

import getAndStoreHeyNativeMintNftScore from './getAndStoreHeyNativeMintNftScore';
import getAndStoreHeyZorbNftScore from './getAndStoreHeyZorbNftScore';

const calculateAdjustments = (id: string, address: Address) => {
  getAndStoreHeyZorbNftScore(id, address);
  getAndStoreHeyNativeMintNftScore(id, address);
};

export default calculateAdjustments;
