import { createPublicClient, http } from 'viem';
import { polygon, polygonMumbai } from 'viem/chains';

/**
 * Create a public client for Polygon and Polygon Mumbai
 * @param isMainnet Is mainnet
 * @returns Public viem client
 */
const publicClient = (isMainnet: boolean): any => {
  return createPublicClient({
    chain: isMainnet ? polygon : polygonMumbai,
    transport: http()
  });
};

export default publicClient;
