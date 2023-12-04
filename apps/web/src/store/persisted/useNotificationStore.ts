import { Localstorage } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationState {
  lastOpenedNotificationId: null | string;
  latestNotificationId: null | string;
  setLastOpenedNotificationId: (id: string) => void;
  setLatestNotificationId: (id: string) => void;
}

export const useNotificationStore = create(
  persist<NotificationState>(
    (set) => ({
      lastOpenedNotificationId: null,
      latestNotificationId: null,
      setLastOpenedNotificationId: (id) =>
        set({ lastOpenedNotificationId: id }),
      setLatestNotificationId: (id) => set({ latestNotificationId: id })
    }),
    { name: Localstorage.NotificationStore }
  )
);
