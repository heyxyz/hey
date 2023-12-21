import { Cookiestorage, IndexDB, Localstorage } from '@hey/data/storage';
import { delMany } from 'idb-keyval';
import Cookies from 'js-cookie';
import { create } from 'zustand';

const cookieConfig: Cookies.CookieAttributes = {
  sameSite: 'strict',
  secure: true
};

interface Tokens {
  accessToken: string | undefined;
  refreshToken: string | undefined;
}

interface AuthState {
  hydrateAuthTokens: () => Tokens;
  signIn: (tokens: { accessToken: string; refreshToken: string }) => void;
  signOut: () => void;
}

const useAuthStore = create<AuthState>(() => ({
  hydrateAuthTokens: () => {
    return {
      accessToken: Cookies.get('accessToken'),
      refreshToken: Cookies.get('refreshToken')
    };
  },
  signIn: ({ accessToken, refreshToken }) => {
    Cookies.set('accessToken', accessToken, { ...cookieConfig, expires: 1 });
    Cookies.set('refreshToken', refreshToken, { ...cookieConfig, expires: 7 });
  },
  signOut: async () => {
    Cookies.remove(Cookiestorage.AccessToken);
    Cookies.remove(Cookiestorage.RefreshToken);

    // Clear Localstorage
    const allLocalstorageStores = Object.values(Localstorage).filter(
      (value) => value !== Localstorage.LeafwatchStore
    );
    for (const store of allLocalstorageStores) {
      localStorage.removeItem(store);
    }

    // Clear IndexedDB
    const allIndexedDBStores = Object.values(IndexDB).filter(
      (value) =>
        value !== IndexDB.AlgorithmStore &&
        value !== IndexDB.VerifiedMembersStore &&
        value !== IndexDB.FeaturedGroupsStore &&
        value !== IndexDB.TBAStore
    );
    await delMany(allIndexedDBStores);
  }
}));

export default useAuthStore;

export const signIn = (tokens: { accessToken: string; refreshToken: string }) =>
  useAuthStore.getState().signIn(tokens);
export const signOut = () => useAuthStore.getState().signOut();
export const hydrateAuthTokens = () =>
  useAuthStore.getState().hydrateAuthTokens();
