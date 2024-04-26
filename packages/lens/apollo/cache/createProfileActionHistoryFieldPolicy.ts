import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createProfileActionHistoryFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['limit']]);
};

export default createProfileActionHistoryFieldPolicy;
