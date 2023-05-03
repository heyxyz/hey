import { createPublicClient, http } from 'viem';
import { polygonMumbai } from 'viem/chains';

const publicClient = (): any => {
  return createPublicClient({
    chain: polygonMumbai,
    transport: http()
  });
};

export default publicClient;
