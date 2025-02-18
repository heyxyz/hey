import type { FieldPolicy } from '@apollo/client';
import cursorBasedPagination from '../helpers/cursorBasedPagination';

const createAccountsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(["request", ['filter']]);
};

export default createAccountsFieldPolicy;
