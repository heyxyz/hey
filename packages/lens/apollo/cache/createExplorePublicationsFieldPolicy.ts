import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createExplorePublicationsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['sortCriteria', 'metadata']]);
};

export default createExplorePublicationsFieldPolicy;
