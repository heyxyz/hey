import type { FieldPolicy } from '@apollo/client';
import { cursorBasedPagination } from '../helpers';

const createWhoReactedPublicationPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['request', ['for', 'limit']]);
};

export default createWhoReactedPublicationPolicy;
