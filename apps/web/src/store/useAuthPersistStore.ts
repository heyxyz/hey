import { IndexDB, Localstorage } from '@hey/data/storage';
import { delMany } from 'idb-keyval';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Tokens {
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthPerisistState {
  accessToken: Tokens['accessToken'];
  refreshToken: Tokens['refreshToken'];
  signIn: (tokens: { accessToken: string; refreshToken: string }) => void;
  signOut: () => void;
  hydrateAuthTokens: () => Tokens;
}

export const useAuthPersistStore = create(
  persist<AuthPerisistState>(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      signIn: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),
      signOut: async () => {
        // Clear Localstorage
        const allLocalstorageStores = Object.values(Localstorage).filter(
          (value) => value !== Localstorage.LeafwatchStore
        );
        for (const store of allLocalstorageStores) {
          localStorage.removeItem(store);
        }

        // Clear IndexedDB
        const allIndexedDBStores = Object.values(IndexDB);
        await delMany(allIndexedDBStores);
      },
      hydrateAuthTokens: () => {
        return {
          accessToken: get().accessToken,
          refreshToken: get().refreshToken
        };
      }
    }),
    { name: Localstorage.AuthStore }
  )
);

export default useAuthPersistStore;

export const signIn = (tokens: { accessToken: string; refreshToken: string }) =>
  useAuthPersistStore.getState().signIn(tokens);
export const signOut = () => useAuthPersistStore.getState().signOut();
export const hydrateAuthTokens = () =>
  useAuthPersistStore.getState().hydrateAuthTokens();
