import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createSearchFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['query', 'type']]);
};

export default createSearchFieldPolicy;
