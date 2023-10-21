import { Localstorage } from '@hey/data/storage';
import { toNanoString } from '@xmtp/xmtp-js';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Each Map is storing a profileId as the key.
interface MessagePersistState {
  viewedMessagesAtNs: Map<string, string | undefined>;
  showMessagesBadge: Map<string, boolean>;
  setShowMessagesBadge: (showMessagesBadge: Map<string, boolean>) => void;
  clearMessagesBadge: (profileId: string) => void;
  unsentMessages: Map<string, string>;
  setUnsentMessage: (key: string, message: string | null) => void;
  setUnsentMessages: (unsentMessages: Map<string, string>) => void;
}

export const useMessagePersistStore = create(
  persist<MessagePersistState>(
    (set) => ({
      viewedMessagesAtNs: new Map(),
      showMessagesBadge: new Map(),
      setShowMessagesBadge: (showMessagesBadge) =>
        set(() => ({ showMessagesBadge })),
      clearMessagesBadge: (profileId: string) => {
        set((state) => {
          const viewedAt = new Map(state.viewedMessagesAtNs);
          viewedAt.set(profileId, toNanoString(new Date()));
          if (!state.showMessagesBadge.get(profileId)) {
            return { viewedMessagesAtNs: viewedAt };
          }
          const show = new Map(state.showMessagesBadge);
          show.set(profileId, false);
          return { viewedMessagesAtNs: viewedAt, showMessagesBadge: show };
        });
      },
      unsentMessages: new Map(),
      setUnsentMessage: (key: string, message: string | null) =>
        set((state) => {
          const newUnsentMessages = new Map(state.unsentMessages);
          if (message) {
            newUnsentMessages.set(key, message);
          } else {
            newUnsentMessages.delete(key);
          }
          return { unsentMessages: newUnsentMessages };
        }),
      setUnsentMessages: (unsentMessages) => set(() => ({ unsentMessages }))
    }),
    {
      name: Localstorage.MessageStore,
      storage: {
        // Persist storage doesn't work well with Map by default.
        // Workaround from: https://github.com/pmndrs/zustand/issues/618#issuecomment-954806720.
        setItem(name, data) {
          const jsonData = JSON.stringify({
            ...data,
            state: {
              ...data.state,
              viewedMessagesAtNs: Array.from(data.state.viewedMessagesAtNs),
              showMessagesBadge: Array.from(data.state.showMessagesBadge),
              unsentMessages: Array.from(data.state.unsentMessages)
            }
          });
          localStorage.setItem(name, jsonData);
        },
        getItem: (name: string) => {
          const jsonData = localStorage.getItem(name);
          if (!jsonData) {
            return null;
          }
          const data = JSON.parse(jsonData);
          data.state.viewedMessagesAtNs = new Map(
            data.state.viewedMessagesAtNs
          );
          data.state.showMessagesBadge = new Map(data.state.showMessagesBadge);
          data.state.unsentMessages = new Map(data.state.unsentMessages);
          return data;
        },
        removeItem(name) {
          localStorage.removeItem(name);
        }
      }
    }
  )
);
