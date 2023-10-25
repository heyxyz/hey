import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createProfilesManagedFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['cursor', 'for']]);
};

export default createProfilesManagedFieldPolicy;
