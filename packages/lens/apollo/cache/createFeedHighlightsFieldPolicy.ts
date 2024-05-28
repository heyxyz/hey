import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../helpers';

const createFeedHighlightsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['where']]);
};

export default createFeedHighlightsFieldPolicy;
