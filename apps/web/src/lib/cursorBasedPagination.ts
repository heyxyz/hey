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

    merge(existing: Readonly<T> | undefined, incoming: SafeReadonly<T>, { readField, mergeObjects }) {
      if (!existing) {
        return incoming;
      }
      const existingItemsIndex: Record<string, number> = Object.create(null);
      const items = (existing.items ?? []).map((item: any, index: number) => {
        const existingItemId: string | undefined = readField('id', item) || readField('id', item?.root);
        if (existingItemId) {
          existingItemsIndex[existingItemId] = index;
        }
        return item;
      });

      (incoming.items ?? []).map((item: any) => {
        const incomingItemId: string | undefined =
          readField<string>('id', item) || readField('id', item?.root);
        if (incomingItemId) {
          const existingItemIndex = existingItemsIndex[incomingItemId];
          if (typeof existingItemIndex === 'number') {
            // Merge the new data with the existing data.
            items[existingItemIndex] = mergeObjects(items[existingItemIndex], item);
          } else {
            // Push new data to the end of the array.
            existingItemsIndex[incomingItemId] = items.length;
            items.push(item);
          }
        }
      });

      return {
        ...incoming,
        items,
        pageInfo: incoming.pageInfo
      } as SafeReadonly<T>;
    }
  };
};

export default cursorBasedPagination;
