import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createApprovedAuthenticationFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request']);
};

export default createApprovedAuthenticationFieldPolicy;
