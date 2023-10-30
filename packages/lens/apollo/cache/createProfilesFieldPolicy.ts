import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createProfilesFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['where']]);
};

export default createProfilesFieldPolicy;
