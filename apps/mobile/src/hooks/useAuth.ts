import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  status: 'idle' | 'signOut' | 'signIn';
  isSignedIn: boolean;
  signIn: (data: string) => void;
  signOut: () => void;
  hydrate: () => void;
}

const TOKEN_STORAGE_KEY = '@pripe/token';

export const useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  isSignedIn: false,
  signIn: async (token) => {
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
    set({ status: 'signIn', token, isSignedIn: true });
  },
  signOut: async () => {
    await AsyncStorage.removeItem('token');
    set({ status: 'signOut', token: null, isSignedIn: false });
  },
  hydrate: async () => {
    try {
      const userToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (userToken !== null) {
        get().signIn(userToken);
      } else {
        get().signOut();
      }
    } catch (error) {
      get().signOut();
    }
  }
}));

export const signOut = () => useAuth.getState().signOut();
export const signIn = (token: string) => useAuth.getState().signIn(token);
export const hydrateAuth = () => useAuth.getState().hydrate();
export const isSignedIn = () => useAuth.getState().isSignedIn;
