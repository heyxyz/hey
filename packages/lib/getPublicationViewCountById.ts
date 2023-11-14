import type { AnyPublication } from '@hey/lens';
import type { PublicationViewCount } from '@hey/types/hey';

import { isMirrorPublication } from './publicationHelpers';

/**
 * Get the number of views of a publication
 * @param views The views of the publications
 * @param publication The publication
 * @returns The number of views of the publication
 */
const getPublicationViewCountById = (
  views: PublicationViewCount[],
  publication: AnyPublication
) => {
  const id = isMirrorPublication(publication)
    ? publication.mirrorOn.id
    : publication.id;

  return views.find((v) => v.id === id)?.views || 0;
};

export default getPublicationViewCountById;
