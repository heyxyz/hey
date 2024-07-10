import type { Address } from 'viem';

import { addToQueue, queue } from '../queue';
import getAndStoreHeyNativeMintNftScore from './getAndStoreHeyNativeMintNftScore';
import getAndStoreHeyZorbNftScore from './getAndStoreHeyZorbNftScore';

queue.process('getAndStoreHeyZorbNftScore', async (job) => {
  const { address, id } = job.data;
  await getAndStoreHeyZorbNftScore(id, address);
});

queue.process('getAndStoreHeyNativeMintNftScore', async (job) => {
  const { address, id } = job.data;
  await getAndStoreHeyNativeMintNftScore(id, address);
});

const calculateAdjustments = (id: string, address: Address) => {
  addToQueue('getAndStoreHeyZorbNftScore', { address, id });
  addToQueue('getAndStoreHeyNativeMintNftScore', { address, id });
};

export default calculateAdjustments;
