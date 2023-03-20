import { STATIC_IMAGES_URL } from 'data/constants';
import type { MetadataOutput } from 'lens';
import getIPFSLink from 'utils/getIPFSLink';

/**
 *
 * @param publication The publication to get the thumbnail url from
 * @returns the thumbnail url from a publication
 */
const getThumbnailUrl = (metadata?: MetadataOutput): string => {
  if (!metadata) {
    return '';
  }

  const url = metadata?.cover?.original.url || metadata?.image || `${STATIC_IMAGES_URL}/placeholder.webp`;
  return getIPFSLink(url);
};

export default getThumbnailUrl;
