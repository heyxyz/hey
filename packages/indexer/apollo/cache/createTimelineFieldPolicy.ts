import type { FieldPolicy } from '@apollo/client';
import cursorBasedPagination from '../helpers/cursorBasedPagination';

const createTimelineFieldPolicy = (): FieldPolicy => {
  return cursorBasedPagination(["request", ["account"]]);
};

export default createTimelineFieldPolicy;
