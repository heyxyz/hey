import type { LensterPublication } from '@generated/types';

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
    `https://ik.imagekit.io/lensterimg/placeholder.webp`;

  return getIPFSLink(url);
};

export default getThumbnailUrl;
