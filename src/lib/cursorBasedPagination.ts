import type { FieldPolicy, StoreValue } from '@apollo/client/core';
import type { PaginatedResultInfo } from '@generated/types';

interface CursorBasedPagination<T = StoreValue> {
  items: T[];
  pageInfo: PaginatedResultInfo;
}

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
          totalCount: pageInfo?.totalCount ?? 0 - danglingItems?.length
        }
      } as SafeReadonly<T>;
    },

    merge(existing: Readonly<T> | undefined, incoming: SafeReadonly<T>) {
      if (!existing) {
        return incoming;
      }

      // there is always a chance (for .e.g notification total count) that `items` was not queried
      // if that's the case assume empty array
      const existingItems = existing.items ?? [];
      const incomingItems = incoming.items ?? [];

      return {
        ...incoming,
        items: existingItems.concat(incomingItems),
        // TODO: Seems to be broken at least for notifications where count query requests
        // only `totalCount` and list query get's only `next`
        pageInfo: incoming?.pageInfo
      } as SafeReadonly<T>;
    }
  };
}
