import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createExplorePublicationsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['where', 'orderBy']]);
};

export default createExplorePublicationsFieldPolicy;
