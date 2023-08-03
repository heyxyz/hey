import { Localstorage } from '@lenster/data/storage';
import resetAuthData from '@lib/resetAuthData';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Tokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

interface AuthPerisistState {
  accessToken: Tokens['accessToken'];
  refreshToken: Tokens['refreshToken'];
  profileId: string | null;
  setProfileId: (profileId: string | null) => void;
  signIn: (tokens: { accessToken: string; refreshToken: string }) => void;
  signOut: () => void;
  hydrateAuthTokens: () => Tokens;
}

export const useAuthPersistStore = create(
  persist<AuthPerisistState>(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      profileId: null,
      setProfileId: (profileId) => set(() => ({ profileId })),
      signIn: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),
      signOut: () => resetAuthData(),
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
