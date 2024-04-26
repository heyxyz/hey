import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createLatestPaidActionsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['limit']]);
};

export default createLatestPaidActionsFieldPolicy;
