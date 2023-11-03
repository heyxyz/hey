import { createPublicClient, http } from 'viem';
import { polygon } from 'viem/chains';

/**
 * Create a public client for Polygon and Polygon Mumbai
 * @returns Public viem client
 */
const publicClient = (): any => {
  return createPublicClient({
    chain: polygon,
    transport: http()
  });
};

export default publicClient;
