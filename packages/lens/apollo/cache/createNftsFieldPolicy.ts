import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createNftsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['where']]);
};

export default createNftsFieldPolicy;
