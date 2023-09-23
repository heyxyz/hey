import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createFeedHighlightsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['where']]);
};

export default createFeedHighlightsFieldPolicy;
