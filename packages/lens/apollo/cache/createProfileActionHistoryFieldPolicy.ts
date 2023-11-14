import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createProfileActionHistoryFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request']);
};

export default createProfileActionHistoryFieldPolicy;
