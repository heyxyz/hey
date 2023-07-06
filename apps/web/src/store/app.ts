import { Localstorage } from '@lenster/data';
import type { Profile } from '@lenster/lens';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  profiles: Profile[] | [];
  setProfiles: (profiles: Profile[]) => void;
  currentProfile: Profile | null;
  setCurrentProfile: (currentProfile: Profile | null) => void;
  profileIsProtected: {
    isProtected: boolean;
    disablingProtectionTimestamp: number | null | undefined;
  };
  setProfileIsProtected: ({
    isProtected,
    disablingProtectionTimestamp
  }: {
    isProtected: boolean;
    disablingProtectionTimestamp: number | null | undefined;
  }) => void;
}

export const useAppStore = create<AppState>((set) => ({
  profiles: [],
  setProfiles: (profiles) => set(() => ({ profiles })),
  currentProfile: null,
  setCurrentProfile: (currentProfile) => set(() => ({ currentProfile })),
  profileIsProtected: {
    isProtected: false,
    disablingProtectionTimestamp: null
  },
  setProfileIsProtected: ({ isProtected, disablingProtectionTimestamp }) =>
    set(() => ({
      profileIsProtected: { isProtected, disablingProtectionTimestamp }
    }))
}));

interface AppPersistState {
  profileId: string | null;
  setProfileId: (profileId: string | null) => void;
  staffMode: boolean;
  setStaffMode: (staffMode: boolean) => void;
  modMode: boolean;
  setModMode: (modMode: boolean) => void;
}

export const useAppPersistStore = create(
  persist<AppPersistState>(
    (set) => ({
      profileId: null,
      setProfileId: (profileId) => set(() => ({ profileId })),
      staffMode: false,
      setStaffMode: (staffMode) => set(() => ({ staffMode })),
      modMode: false,
      setModMode: (modMode) => set(() => ({ modMode }))
    }),
    { name: Localstorage.LensterStore }
  )
);
