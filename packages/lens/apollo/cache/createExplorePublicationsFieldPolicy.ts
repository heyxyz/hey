import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createExplorePublicationsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['where', 'orderBy']]);
};

export default createExplorePublicationsFieldPolicy;
