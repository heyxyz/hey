import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createApprovedAuthenticationsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['limit']]);
};

export default createApprovedAuthenticationsFieldPolicy;
