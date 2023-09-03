import type { ZoraNftMetadata } from '@lenster/types/zora-nft';

import getZoraNFT from './getZoraNft';

const knownSites = new Set(['zora.co']);

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

  const url = knownUrls[0];
  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname.replace('www.', '');

  if (hostname === 'zora.co') {
    return getZoraNFT(url);
  }

  return null;
};

export default getNft;
