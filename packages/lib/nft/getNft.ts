import type { NftMetadata } from '@hey/types/nft';

import getBasePaintCanvas from './getBasePaintCanvas';
import getUnlonelyChannel from './getUnlonelyChannel';
import getUnlonelyNfc from './getUnlonelyNfc';
import getZoraNFT from './getZoraNft';

const knownSites = new Set([
  'zora.co',
  'testnet.zora.co',
  'basepaint.art',
  'unlonely.app'
]);

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
  const path = new URL(url).pathname;

  switch (true) {
    case hostname === 'zora.co':
    case hostname === 'testnet.zora.co':
      return getZoraNFT(url);
    case hostname === 'basepaint.art':
      return getBasePaintCanvas(url);
    case hostname === 'unlonely.app' && path.startsWith('/channels'):
      return getUnlonelyChannel(url);
    case hostname === 'unlonely.app' && path.startsWith('/nfc'):
      return getUnlonelyNfc(url);
    default:
      return null;
  }
};

export default getNft;
