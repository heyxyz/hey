import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createPublicationsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination([
    'request',
    ['profileId', 'collectedBy', 'commentsOf', 'publicationTypes', 'metadata', 'commentsRankingFilter']
  ]);
};

export default createPublicationsFieldPolicy;
