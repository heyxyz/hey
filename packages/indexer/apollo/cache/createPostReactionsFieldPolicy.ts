import type { FieldPolicy } from '@apollo/client';
import cursorBasedPagination from '../helpers/cursorBasedPagination';

const createPostReactionsFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(["request", ["post"]]);
};

export default createPostReactionsFieldPolicy;
