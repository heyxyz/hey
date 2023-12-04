import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createProfilesManagedFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['for']]);
};

export default createProfilesManagedFieldPolicy;
