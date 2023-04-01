import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createFeedHighlightsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['profileId']]);
};

export default createFeedHighlightsFieldPolicy;
