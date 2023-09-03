import type { ZoraNftMetadata } from '@lenster/types/zora-nft';

const mainnetChains = ['eth', 'zora', 'base'];
export const regex =
  /https:\/\/(?:testnet\.)?zora\.co\/collect\/(eth|base|zora|zgor):(0x[\dA-Fa-f]{40})((?:\/(\d+))?|$)/;

/**
 * Get Zora NFT metadata from a URL
 * @param url URL
 * @returns Zora NFT metadata
 */
const getZoraNFT = (url: string): ZoraNftMetadata | null => {
  const matches = regex.exec(url);
  if (regex.test(url) && matches && matches.length >= 3) {
    const chain = matches[1];
    const address = matches[2];
    const token = matches[4];
    const network = mainnetChains.includes(chain) ? 'mainnet' : 'testnet';

    return { chain, address, token, network };
  }

  return null;
};

export default getZoraNFT;
