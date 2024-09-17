import type { FieldPolicy, StoreValue } from "@apollo/client/core";

import type { PaginatedResultInfo } from "../../generated";

interface CursorBasedPagination<T = StoreValue> {
  items: T[];
  pageInfo: PaginatedResultInfo;
}

type SafeReadonly<T> = T extends object ? Readonly<T> : T;

/**
 * Generates a field policy for cursor-based pagination.
 *
 * @param keyArgs Key args for the field.
 * @returns Field policy for cursor-based pagination.
 */
export const cursorBasedPagination = <T extends CursorBasedPagination>(
  keyArgs: FieldPolicy["keyArgs"]
): FieldPolicy<T> => {
  return {
    keyArgs,

    merge(existing: Readonly<T> | undefined, incoming: SafeReadonly<T>) {
      if (!existing) {
        return incoming;
      }

      const existingItems = existing.items || [];
      const incomingItems = incoming.items || [];

      return {
        ...incoming,
        items: existingItems?.concat(incomingItems),
        pageInfo: incoming.pageInfo
      } as SafeReadonly<T>;
    },

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
    }
  };
};

export default cursorBasedPagination;
