import { IPFS_GATEWAY } from 'data/constants';

/**
 * Get IPFS link from the IPFS hash.
 *
 * @param hash - IPFS hash
 * @returns IPFS link
 */
const getIPFSLink = (hash: string): string => {
  if (!hash) {
    return '';
  }

  return hash
    .replace(/^Qm[1-9A-Za-z]{44}/gm, `${IPFS_GATEWAY}${hash}`)
    .replace('https://ipfs.io/ipfs/', IPFS_GATEWAY)
    .replace('ipfs://ipfs/', IPFS_GATEWAY)
    .replace('ipfs://', IPFS_GATEWAY);
};

export default getIPFSLink;
