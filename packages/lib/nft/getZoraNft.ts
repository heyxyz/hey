import type { BasicNftMetadata } from '@hey/types/nft';

export const regex =
  /https:\/\/(?:testnet\.)?zora\.co\/collect\/(eth|oeth|base|zora|gor|ogor|basegor|zgor):(0x[\dA-Fa-f]{40})((?:\/(\d+))?|$)/;

/**
 * Get Zora NFT metadata from a URL
 * @param url URL
 * @returns Zora NFT metadata
 */
const getZoraNFT = (url: string): BasicNftMetadata | null => {
  const matches = regex.exec(url);
  if (regex.test(url) && matches && matches.length >= 3) {
    const chain = matches[1];
    const address = matches[2];
    const token = matches[4];

    return { chain, address, token, provider: 'zora' };
  }

  return null;
};

export default getZoraNFT;
