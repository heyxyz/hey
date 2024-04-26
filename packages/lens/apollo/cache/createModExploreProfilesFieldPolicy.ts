import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createModExploreProfilesFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['where', 'orderBy']]);
};

export default createModExploreProfilesFieldPolicy;
