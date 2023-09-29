import type { BasePaintCanvasMetadata } from '@hey/types/nft';

const regex = /https:\/\/basepaint\.art\/mint\/(\d+)/;

/**
 * Get BasePaint canvas id from a URL
 * @param url URL
 * @returns BasePaint canvas metadata
 */
const getBasePaintCanvas = (url: string): BasePaintCanvasMetadata | null => {
  const matches = regex.exec(url);
  if (matches && matches[1]) {
    const id = parseInt(matches[1]);
    return { id, provider: 'basepaint' };
  }

  return null;
};

export default getBasePaintCanvas;
