import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createWhoHaveBlockedFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['limit']]);
};

export default createWhoHaveBlockedFieldPolicy;
