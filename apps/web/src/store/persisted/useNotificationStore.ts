import { Localstorage } from "@hey/data/storage";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  lastOpenedNotificationId: null | string;
  latestNotificationId: null | string;
  setLastOpenedNotificationId: (id: string) => void;
  setLatestNotificationId: (id: string) => void;
}

const store = create(
  persist<State>(
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

export const useNotificationStore = createTrackedSelector(store);
