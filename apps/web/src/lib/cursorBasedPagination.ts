import type { FieldPolicy, StoreValue } from '@apollo/client/core';
import type { PaginatedResultInfo } from 'lens';

interface CursorBasedPagination<T = StoreValue> {
  items: T[];
  pageInfo: PaginatedResultInfo;
}

type SafeReadonly<T> = T extends object ? Readonly<T> : T;

/**
 *
 * @param keyArgs key args for the field
 * @returns a field policy for cursor based pagination
 */
export const cursorBasedPagination = <T extends CursorBasedPagination>(
  keyArgs: FieldPolicy['keyArgs']
): FieldPolicy<T> => {
  return {
    keyArgs,

    read(existing: SafeReadonly<T> | undefined) {
      if (!existing) {
        return existing;
      }
      const { items, pageInfo } = existing;

      return {
        ...existing,
        items,
        pageInfo: {
          ...pageInfo
        }
      } as SafeReadonly<T>;
    },

    merge(existing: Readonly<T> | undefined, incoming: SafeReadonly<T>) {
      if (!existing) {
        return incoming;
      }

      const existingItems = existing.items ?? [];
      const incomingItems = incoming.items ?? [];

      return {
        ...incoming,
        items: existingItems?.concat(incomingItems),
        pageInfo: incoming.pageInfo
      } as SafeReadonly<T>;
    }
  };
};

export default cursorBasedPagination;
