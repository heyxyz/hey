import type { LensterPublication } from '@generated/types';
import { IMGPROXY_URL } from 'data/constants';

import getIPFSLink from './getIPFSLink';

/**
 *
 * @param publication - The publication to get the thumbnail url from
 * @returns the thumbnail url from a publication
 */
const getThumbnailUrl = (publication: LensterPublication | undefined): string => {
  if (!publication) {
    return '';
  }
  const url =
    publication.metadata?.cover?.original.url ||
    publication.metadata?.image ||
    `${IMGPROXY_URL}/placeholder.webp`;

  return getIPFSLink(url);
};

export default getThumbnailUrl;
