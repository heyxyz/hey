import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createNftsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['ownerAddress', 'chainIds']]);
};

export default createNftsFieldPolicy;
