import type { FieldPolicy } from '@apollo/client';
import cursorBasedPagination from '../helpers/cursorBasedPagination';

const createPostReferencesFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(["request", ['referencedPost', 'referenceTypes', 'visibilityFilter']]);
};

export default createPostReferencesFieldPolicy;
