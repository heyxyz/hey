import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createProfilesManagedFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['for']]);
};

export default createProfilesManagedFieldPolicy;
