import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createModExploreProfilesFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['where', 'orderBy']]);
};

export default createModExploreProfilesFieldPolicy;
