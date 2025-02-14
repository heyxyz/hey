import type { FieldPolicy } from '@apollo/client';
import cursorBasedPagination from '../helpers/cursorBasedPagination';

const createTimelineFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(['account']);
};

export default createTimelineFieldPolicy;
