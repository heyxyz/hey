import type { Profile } from '@generated/types';
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
  lastViewedMessagesAt: Date | null;
  clearMessagesBadge: () => boolean;
  showUnreadMessages: boolean;
  setShowUnreadMessages: (show: boolean) => void;
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
      lastViewedMessagesAt: null,
      clearMessagesBadge: () => {
        let updated = false;
        set((state) => {
          if (state.showUnreadMessages) {
            updated = true;
            return { lastViewedMessagesAt: new Date(), showUnreadMessages: false };
          } else {
            return {
              lastViewedMessagesAt: state.lastViewedMessagesAt,
              showUnreadMessages: state.showUnreadMessages
            };
          }
        });
        return updated;
      },
      showUnreadMessages: false,
      setShowUnreadMessages: (showUnreadMessages) => set(() => ({ showUnreadMessages }))
    }),
    { name: LS_KEYS.LENSTER_STORE }
  )
);
