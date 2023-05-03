import { createPublicClient, http } from 'viem';
import { polygon, polygonMumbai } from 'viem/chains';

const publicClient = (isMainnet: boolean): any => {
  return createPublicClient({
    chain: isMainnet ? polygon : polygonMumbai,
    transport: http()
  });
};

export default publicClient;
