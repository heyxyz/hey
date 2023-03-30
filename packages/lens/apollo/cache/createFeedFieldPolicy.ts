import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createFeedFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['profileId', 'feedEventItemTypes']]);
};

export default createFeedFieldPolicy;
