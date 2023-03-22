import { IPFS_GATEWAY } from 'data/constants';

/**
 * Returns the IPFS link for a given hash.
 * @param hash - The IPFS hash.
 * @returns The IPFS link.
 */
const getIPFSLink = (hash?: string): string => {
  if (!hash) {
    return '';
  }

  const gateway = IPFS_GATEWAY;

  let link = hash.replace(/^Qm[1-9A-Za-z]{44}/gm, `${gateway}${hash}`);
  link = link.replace('https://ipfs.io/ipfs/', gateway);
  link = link.replace('ipfs://ipfs/', gateway);
  link = link.replace('ipfs://', gateway);

  return link;
};

export default getIPFSLink;
