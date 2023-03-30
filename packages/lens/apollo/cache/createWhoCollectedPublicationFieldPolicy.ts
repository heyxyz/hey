import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createWhoCollectedPublicationFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['publicationId']]);
};

export default createWhoCollectedPublicationFieldPolicy;
