import AsynStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Tokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

interface AuthPerisistState {
  accessToken: Tokens['accessToken'];
  refreshToken: Tokens['refreshToken'];
  selectedChannelId: string | null;
  setSelectedChannelId: (id: string | null) => void;
  signIn: (tokens: { accessToken: string; refreshToken: string }) => void;
  signOut: () => void;
  hydrateAuthTokens: () => Tokens;
}

const useMobilePersistStore = create<AuthPerisistState>(
  // @ts-expect-error zustand
  persist<AuthPerisistState>(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      selectedChannelId: null,
      setSelectedChannelId: (id) => set({ selectedChannelId: id }),
      signIn: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),
      signOut: () => {
        localStorage.removeItem('lenster.store');
        localStorage.removeItem('lenster.auth.store');
      },
      hydrateAuthTokens: () => {
        return {
          accessToken: get().accessToken,
          refreshToken: get().refreshToken
        };
      }
    }),
    {
      name: 'lenster.auth.store',
      getStorage: () => AsynStorage
    }
  )
);

export default useMobilePersistStore;
