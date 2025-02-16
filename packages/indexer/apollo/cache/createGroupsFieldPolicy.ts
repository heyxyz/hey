import type { FieldPolicy } from '@apollo/client';
import cursorBasedPagination from '../helpers/cursorBasedPagination';

const createGroupsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(["request", ['filter']]);
};

export default createGroupsFieldPolicy;
