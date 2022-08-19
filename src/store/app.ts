/* eslint-disable no-unused-vars */
import { Profile } from '@generated/types';
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  profiles: Profile[] | [];
  setProfiles: (profiles: Profile[]) => void;
  currentProfile: Profile | undefined;
  setCurrentProfile: (currentProfile: Profile | undefined) => void;
  userSigNonce: number;
  setUserSigNonce: (userSigNonce: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  profiles: [],
  setProfiles: (profiles) => set(() => ({ profiles })),
  currentProfile: undefined,
  setCurrentProfile: (currentProfile) => set(() => ({ currentProfile })),
  userSigNonce: 0,
  setUserSigNonce: (userSigNonce) => set(() => ({ userSigNonce }))
}));

interface AppPersistState {
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  profileId: string | null;
  setProfileId: (profileId: string | null) => void;
  staffMode: boolean;
  setStaffMode: (staffMode: boolean) => void;
  notificationCount: number;
  setNotificationCount: (notificationCount: number) => void;
}

export const useAppPersistStore = create(
  persist<AppPersistState>(
    (set) => ({
      isConnected: false,
      setIsConnected: (isConnected) => set(() => ({ isConnected })),
      isAuthenticated: false,
      setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
      profileId: null,
      setProfileId: (profileId) => set(() => ({ profileId })),
      staffMode: false,
      setStaffMode: (staffMode) => set(() => ({ staffMode })),
      notificationCount: 0,
      setNotificationCount: (notificationCount) => set(() => ({ notificationCount }))
    }),
    { name: 'lenster.store' }
  )
);
