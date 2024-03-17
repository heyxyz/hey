import { ARWEAVE_GATEWAY, IPFS_GATEWAY } from '@hey/data/constants';

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

  const gateway = `${IPFS_GATEWAY}/`;

  let link = hash.replace(/^Qm[1-9A-Za-z]{44}/gm, `${IPFS_GATEWAY}/${hash}`);
  link = link.replace('https://ipfs.io/ipfs/', gateway);
  link = link.replace('ipfs://ipfs/', gateway);
  link = link.replace('ipfs://', gateway);
  link = link.replace('ar://', ARWEAVE_GATEWAY);

  return link;
};

export default sanitizeDStorageUrl;
