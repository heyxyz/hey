import type { ZoraNftMetadata } from '@lenster/types/zora-nft';

import getZoraNFT from './getZoraNft';

const knownSites = new Set(['zora.co', 'testnet.zora.co']);

/**
 * Get NFT metadata from a list of URLs
 * @param urls List of URLs
 * @returns NFT metadata
 */
const getNft = (urls: string[]): ZoraNftMetadata | null => {
  if (!urls.length) {
    return null;
  }

  const knownUrls = urls.filter((url) => {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace('www.', '');
    return knownSites.has(hostname);
  });

  if (!knownUrls.length) {
    return null;
  }

  return getZoraNFT(knownUrls[0]);
};

export default getNft;
