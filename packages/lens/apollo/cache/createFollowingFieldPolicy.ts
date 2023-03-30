import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createFollowingFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['address']]);
};

export default createFollowingFieldPolicy;
