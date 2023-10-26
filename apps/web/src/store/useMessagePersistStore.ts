import { Localstorage } from '@hey/data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MessagePersistState {
  unsentMessages: Map<string, string>;
  setUnsentMessage: (key: string, message: string | null) => void;
}

export const useMessagePersistStore = create(
  persist<MessagePersistState>(
    (set) => ({
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
        })
    }),
    {
      name: Localstorage.MessageStore,
      storage: {
        setItem(name, data) {
          const jsonData = JSON.stringify({
            ...data,
            state: {
              ...data.state,
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
