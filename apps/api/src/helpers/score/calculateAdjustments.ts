import type { Address } from 'viem';

import getAndStoreZorbScore from './getAndStoreZorbScore';

const calculateAdjustments = (id: string, address: Address) => {
  getAndStoreZorbScore(id, address);

  return true;
};

export default calculateAdjustments;
