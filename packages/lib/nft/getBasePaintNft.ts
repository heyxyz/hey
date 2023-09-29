import type { BasePaintNftMetadata } from '@hey/types/nft';

const regex = /https:\/\/basepaint\.art\/mint\/(\d+)/;

/**
 * Get BasePaint NFT metadata from a URL
 * @param url URL
 * @returns BasePaint NFT metadata
 */
const getBasePaintNft = (url: string): BasePaintNftMetadata | null => {
  const matches = regex.exec(url);
  if (matches && matches[1]) {
    const id = parseInt(matches[1]);
    return { id, provider: 'basepaint' };
  }

  return null;
};

export default getBasePaintNft;
