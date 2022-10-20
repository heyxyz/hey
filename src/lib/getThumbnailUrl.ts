import type { LensterPublication } from '@generated/lenstertypes';

import getIPFSLink from './getIPFSLink';

const getThumbnailUrl = (publication: LensterPublication | undefined): string => {
  if (!publication) {
    return '';
  }
  const url = publication.metadata?.cover?.original.url || publication.metadata?.image;

  return getIPFSLink(url);
};

export default getThumbnailUrl;
