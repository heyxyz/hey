import type { FieldPolicy, StoreValue } from '@apollo/client/core';
import type { PaginatedResultInfo } from 'lens';

interface CursorBasedPagination<T = StoreValue> {
  items: T[];
  pageInfo: PaginatedResultInfo;
}

type SafeReadonly<T> = T extends object ? Readonly<T> : T;

export const cursorBasedPagination = <T extends CursorBasedPagination>(
  keyArgs: FieldPolicy['keyArgs']
): FieldPolicy<T> => {
  return {
    keyArgs,

    read(existing: SafeReadonly<T> | undefined, { canRead }) {
      if (!existing) {
        return existing;
      }

      const { items, pageInfo } = existing;
      const removedItems = items?.filter((item) => !canRead(item));

      return {
        ...existing,
        items,
        pageInfo: {
          ...pageInfo,
          totalCount: pageInfo?.totalCount ? pageInfo.totalCount - removedItems?.length : null
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
