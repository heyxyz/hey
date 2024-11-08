import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

type Session = {
  accessToken: string | null;
  refreshToken: string | null;
  id: string | null;
};

type AuthState = {
  session: Session;
  hydrated: boolean;
  signOut: () => Promise<void>;
  hydrate: () => Promise<void>;
  getSession: () => Promise<Session>;
  signIn: (session: Session) => Promise<void>;
};

const getStorageItemAsync = async (key: string) => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error("Error getting storage item:", error);
    return null;
  }
};

const setStorageItemAsync = async (key: string, value: string | null) => {
  try {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error("Error setting storage item:", error);
    return null;
  }
};

export const useAuthStore = create<AuthState>()((set) => ({
  session: {
    id: null,
    accessToken: null,
    refreshToken: null
  },
  hydrated: false,
  signIn: async (session: Session) => {
    const { accessToken, refreshToken, id } = session;
    set({
      session,
      hydrated: Boolean(accessToken) && Boolean(refreshToken)
    });
    await setStorageItemAsync("id", id);
    await setStorageItemAsync("accessToken", accessToken);
    await setStorageItemAsync("refreshToken", refreshToken);
  },
  signOut: async () => {
    set({
      session: {
        id: null,
        accessToken: null,
        refreshToken: null
      }
    });
    await setStorageItemAsync("id", null);
    await setStorageItemAsync("accessToken", null);
    await setStorageItemAsync("refreshToken", null);
  },
  getSession: async () => {
    return {
      id: await getStorageItemAsync("id"),
      accessToken: await getStorageItemAsync("accessToken"),
      refreshToken: await getStorageItemAsync("refreshToken")
    };
  },
  hydrate: async () => {
    const id = await getStorageItemAsync("id");
    const accessToken = await getStorageItemAsync("accessToken");
    const refreshToken = await getStorageItemAsync("refreshToken");

    set({
      session: { id, accessToken, refreshToken },
      hydrated: true
    });
  }
}));

export const signOut = () => useAuthStore.getState().signOut();
export const getSession = () => useAuthStore.getState().getSession();
export const hydrateSession = () => useAuthStore.getState().hydrate();
export const signIn = (s: Session) => useAuthStore.getState().signIn(s);
