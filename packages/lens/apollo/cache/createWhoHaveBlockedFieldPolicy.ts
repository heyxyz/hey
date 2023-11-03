import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createWhoHaveBlockedFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['limit']]);
};

export default createWhoHaveBlockedFieldPolicy;
