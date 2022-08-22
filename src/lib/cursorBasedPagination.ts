import { FieldPolicy, StoreValue } from '@apollo/client/core';
import { PaginatedResultInfo } from '@generated/types';

type CursorBasedPagination<T = StoreValue> = {
  items: T[];
  pageInfo: PaginatedResultInfo;
};

type SafeReadonly<T> = T extends object ? Readonly<T> : T;

export function cursorBasedPagination<T extends CursorBasedPagination>(
  keyArgs: FieldPolicy['keyArgs']
): FieldPolicy<T> {
  return {
    keyArgs,

    read(existing: SafeReadonly<T> | undefined, { canRead }) {
      if (!existing) {
        return existing;
      }

      const { items, pageInfo } = existing;

      // items that are not in the cache anymore (for .e.g deleted publication)
      const danglingItems = items?.filter((item) => !canRead(item));

      return {
        ...existing,
        items,
        pageInfo: {
          ...pageInfo,
          // reduce total count by excluding dangling items so it won't cause a new page query
          // after item was removed from the cache (for .e.g deleted publication)
          totalCount: pageInfo?.totalCount - danglingItems?.length
        }
      } as SafeReadonly<T>;
    },

    merge(existing: Readonly<T> | undefined, incoming: SafeReadonly<T>) {
      if (!existing) {
        return incoming;
      }

      const existingItems = existing.items;
      const incomingItems = incoming.items;

      return {
        ...incoming,
        items: existingItems?.concat(incomingItems),
        pageInfo: incoming?.pageInfo
      } as SafeReadonly<T>;
    }
  };
}
