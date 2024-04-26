import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createFeedFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['where']]);
};

export default createFeedFieldPolicy;
