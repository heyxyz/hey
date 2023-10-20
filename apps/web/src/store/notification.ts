import { Localstorage } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationPersistState {
  latestNotificationId: string | null;
  setLatestNotificationId: (id: string) => void;
  lastOpenedNotificationId: string | null;
  setLastOpenedNotificationId: (id: string) => void;
}

export const useNotificationPersistStore = create(
  persist<NotificationPersistState>(
    (set) => ({
      latestNotificationId: null,
      setLatestNotificationId: (id) => set({ latestNotificationId: id }),
      lastOpenedNotificationId: null,
      setLastOpenedNotificationId: (id) => set({ lastOpenedNotificationId: id })
    }),
    { name: Localstorage.NotificationStore }
  )
);
