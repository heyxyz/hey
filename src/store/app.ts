import type { Profile } from '@generated/types';
import { toNanoString } from '@xmtp/xmtp-js';
import { LS_KEYS } from 'src/constants';
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  profiles: Profile[] | [];
  setProfiles: (profiles: Profile[]) => void;
  currentProfile: Profile | null;
  setCurrentProfile: (currentProfile: Profile | null) => void;
  userSigNonce: number;
  setUserSigNonce: (userSigNonce: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  profiles: [],
  setProfiles: (profiles) => set(() => ({ profiles })),
  currentProfile: null,
  setCurrentProfile: (currentProfile) => set(() => ({ currentProfile })),
  userSigNonce: 0,
  setUserSigNonce: (userSigNonce) => set(() => ({ userSigNonce }))
}));

interface AppPersistState {
  profileId: string | null;
  setProfileId: (profileId: string | null) => void;
  handle: string | null;
  setHandle: (handle: string | null) => void;
  staffMode: boolean;
  setStaffMode: (staffMode: boolean) => void;
  notificationCount: number;
  setNotificationCount: (notificationCount: number) => void;
  viewedMessagesAtNs: string | undefined;
  clearMessagesBadge: () => boolean;
  showMessagesBadge: boolean;
  setShowMessagesBadge: (show: boolean) => void;
}

export const useAppPersistStore = create(
  persist<AppPersistState>(
    (set) => ({
      profileId: null,
      setProfileId: (profileId) => set(() => ({ profileId })),
      handle: null,
      setHandle: (handle) => set(() => ({ handle })),
      staffMode: false,
      setStaffMode: (staffMode) => set(() => ({ staffMode })),
      notificationCount: 0,
      setNotificationCount: (notificationCount) => set(() => ({ notificationCount })),
      viewedMessagesAtNs: undefined,
      clearMessagesBadge: () => {
        let updated = false;
        set((state) => {
          if (state.showMessagesBadge) {
            updated = true;
            return { viewedMessagesAtNs: toNanoString(new Date()), showMessagesBadge: false };
          } else {
            return {
              viewedMessagesAtNs: state.viewedMessagesAtNs,
              showMessagesBadge: state.showMessagesBadge
            };
          }
        });
        return updated;
      },
      showMessagesBadge: false,
      setShowMessagesBadge: (showMessagesBadge) => set(() => ({ showMessagesBadge }))
    }),
    { name: LS_KEYS.LENSTER_STORE }
  )
);
