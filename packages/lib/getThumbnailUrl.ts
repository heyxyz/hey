import { STATIC_IMAGES_URL } from '@lenster/data/constants';
import type { MetadataOutput } from '@lenster/lens';

import sanitizeDStorageUrl from './sanitizeDStorageUrl';

/**
 * Returns the thumbnail URL for the specified publication metadata.
 *
 * @param metadata The publication metadata.
 * @returns The thumbnail URL.
 */
const getThumbnailUrl = (metadata?: MetadataOutput): string => {
  const fallbackUrl = `${STATIC_IMAGES_URL}/thumbnail.png`;

  if (!metadata) {
    return fallbackUrl;
  }

  const { cover } = metadata;
  const url = cover?.original?.url || fallbackUrl;

  return sanitizeDStorageUrl(url);
};

export default getThumbnailUrl;
