import { IPFS_GATEWAY } from 'data/constants';

/**
 *
 * @param hash - IPFS hash
 * @returns IPFS link
 */
const getIPFSLink = (hash: string): string => {
  if (!hash) {
    return '';
  }
  const gateway = IPFS_GATEWAY;

  return hash
    .replace(/^Qm[1-9A-Za-z]{44}/gm, `${gateway}${hash}`)
    .replace('https://ipfs.io/ipfs/', gateway)
    .replace('ipfs://', gateway);
};

export default getIPFSLink;
