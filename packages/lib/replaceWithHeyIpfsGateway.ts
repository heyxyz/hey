import { IPFS_GATEWAY } from '@hey/data/constants';

/**
 * Replace the IPFS gateway with the Hey IPFS gateway
 * @param uri - The URI to replace
 * @returns The URI with the Hey IPFS gateway
 */
const replaceWithHeyIpfsGateway = (uri: string): string => {
  if (uri?.includes('gw.ipfs-lens.dev/ipfs')) {
    return uri.replace('https://gw.ipfs-lens.dev/ipfs/', IPFS_GATEWAY);
  }

  return uri;
};

export default replaceWithHeyIpfsGateway;
