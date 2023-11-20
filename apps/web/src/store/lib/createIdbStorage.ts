import { del, get, set } from 'idb-keyval';
import type { StorageValue } from 'zustand/middleware';

import idbReplacer from './idbReplacer';
import idbReviver from './idbReviver';

const createIdbStorage = () => {
  return {
    getItem: async (name: string) =>
      JSON.parse((await get(name)) || '{}', idbReviver),
    setItem: async (name: string, value: StorageValue<any>) => {
      const str = JSON.stringify({ state: { ...value.state } }, idbReplacer);
      return await set(name, str);
    },
    removeItem: async (name: string) => await del(name)
  };
};

export default createIdbStorage;
