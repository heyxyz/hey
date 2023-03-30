import type { FieldPolicy } from '@apollo/client';

import { cursorBasedPagination } from '../lib';

const createWhoReactedPublicationFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['publicationId']]);
};

export default createWhoReactedPublicationFieldPolicy;
