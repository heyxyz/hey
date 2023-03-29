import type { FieldPolicy, StoreValue } from '@apollo/client/core';
import type { PaginatedResultInfo } from 'lens';

const getRef = (obj: any): string | null => {
  if (typeof obj === 'object' && obj !== null) {
    if ('__ref' in obj) {
      return obj['__ref'];
    } else {
      for (const key in obj) {
        const ref = getRef(obj[key]);
        if (ref) {
          return ref;
        }
      }
    }
  }
  return null;
};

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

      const existingRefs = new Set();
      for (const item of existing.items ?? []) {
        const ref = getRef(item);
        if (ref) {
          existingRefs.add(ref);
        }
      }

      const items = [...existing.items];
      for (const item of incoming.items ?? []) {
        const ref = getRef(item);
        if (ref && !existingRefs.has(ref)) {
          items.push(item);
          existingRefs.add(ref);
        }
      }

      return { ...incoming, items, pageInfo: incoming.pageInfo } as SafeReadonly<T>;
    }
  };
};

export default cursorBasedPagination;
