import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createLatestPaidActionsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['limit']]);
};

export default createLatestPaidActionsFieldPolicy;
