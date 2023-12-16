import { Localstorage } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createIdbStorage from '../lib/createIdbStorage';

interface XMTPState {
  getKeys: () => Buffer | null;
  keys: null | string;
  setKeys: (keys: Uint8Array) => void;
}

export const useXMTP = create(
  persist<XMTPState>(
    (set, get) => ({
      getKeys: () => {
        const { keys: storedKeys } = get();
        if (!storedKeys) {
          return null;
        }
        return Buffer.from(storedKeys, 'base64');
      },
      keys: null,
      setKeys: (keys: Uint8Array) => {
        set({ keys: Buffer.from(keys).toString('base64') });
      }
    }),
    {
      name: Localstorage.XMPTStore,
      storage: createIdbStorage()
    }
  )
);

export default useXMTP;
