import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createExploreProfilesFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['where', 'orderBy']]);
};

export default createExploreProfilesFieldPolicy;
