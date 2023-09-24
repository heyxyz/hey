import { ARWEAVE_GATEWAY, IPFS_GATEWAY } from '@lenster/data/constants';

/**
 * Returns the IPFS link for a given hash.
 *
 * @param hash The IPFS hash.
 * @returns The IPFS link.
 */
const sanitizeDStorageUrl = (hash?: string): string => {
  if (!hash) {
    return '';
  }

  let link = hash.replace(/^Qm[1-9A-Za-z]{44}/gm, `${IPFS_GATEWAY}${hash}`);
  link = link.replace('https://ipfs.io/ipfs/', IPFS_GATEWAY);
  link = link.replace('ipfs://ipfs/', IPFS_GATEWAY);
  link = link.replace('ipfs://', IPFS_GATEWAY);
  link = link.replace('ar://', ARWEAVE_GATEWAY);

  return link;
};

export default sanitizeDStorageUrl;
