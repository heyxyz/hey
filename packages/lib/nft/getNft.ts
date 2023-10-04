import type { NftMetadata } from '@hey/types/nft';

import getBasePaintCanvas from './getBasePaintCanvas';
import getZoraNFT from './getZoraNft';

const knownSites = new Set(['zora.co', 'testnet.zora.co', 'basepaint.art']);

/**
 * Get NFT metadata from a list of URLs
 * @param urls List of URLs
 * @returns NFT metadata
 */
const getNft = (urls: string[]): NftMetadata | null => {
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
  const hostname = new URL(url).hostname.replace('www.', '');

  switch (hostname) {
    case 'zora.co':
    case 'testnet.zora.co':
      return getZoraNFT(url);
    case 'basepaint.art':
      return getBasePaintCanvas(url);
    default:
      return null;
  }
};

export default getNft;
