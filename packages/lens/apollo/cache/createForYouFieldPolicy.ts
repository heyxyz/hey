import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createForYouFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['for']]);
};

export default createForYouFieldPolicy;
