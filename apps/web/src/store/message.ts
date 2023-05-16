import getUniqueMessages from '@lib/getUniqueMessages';
import type { Client, Conversation, DecodedMessage } from '@xmtp/xmtp-js';
import { toNanoString } from '@xmtp/xmtp-js';
import { Localstorage } from 'data/storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TabValues = 'Following' | 'Requested' | 'Other';

interface MessageState {
  client: Client | undefined;
  setClient: (client: Client | undefined) => void;
  conversations: Map<string, Conversation>;
  setConversations: (conversations: Map<string, Conversation>) => void;
  addConversation: (key: string, newConversation: Conversation) => void;
  messages: Map<string, DecodedMessage[]>;
  addMessages: (key: string, newMessages: DecodedMessage[]) => number;
  hasSyncedMessages: boolean;
  setHasSyncedMessages: (hasSyncedMessages: boolean) => void;
  previewMessages: Map<string, DecodedMessage>;
  setPreviewMessages: (previewMessages: Map<string, DecodedMessage>) => void;
  previewMessagesNonLens: Map<string, DecodedMessage>;
  setPreviewMessagesNonLens: (
    previewMessagesNonLens: Map<string, DecodedMessage>
  ) => void;
  selectedProfileId: string;
  setSelectedProfileId: (selectedProfileId: string) => void;
  selectedTab: TabValues;
  setSelectedTab: (selectedTab: TabValues) => void;
  syncedProfiles: Set<string>;
  addSyncedProfiles: (profileIds: string[]) => void;
  unsyncProfile: (profileId: string) => void;
  reset: () => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  client: undefined,
  setClient: (client) => set(() => ({ client })),
  conversations: new Map(),
  setConversations: (conversations) => set(() => ({ conversations })),
  addConversation: (key: string, newConversation: Conversation) => {
    set((state) => {
      const conversations = new Map(state.conversations);
      conversations.set(key, newConversation);
      return { conversations };
    });
  },
  messages: new Map(),
  addMessages: (key: string, newMessages: DecodedMessage[]) => {
    let numAdded = 0;
    set((state) => {
      const messages = new Map(state.messages);
      const existing = state.messages.get(key) || [];
      const updated = getUniqueMessages([...existing, ...newMessages]);
      numAdded = updated.length - existing.length;
      // If nothing has been added, return the old item to avoid unnecessary refresh
      if (!numAdded) {
        return { messages: state.messages };
      }
      messages.set(key, updated);
      return { messages };
    });
    return numAdded;
  },
  hasSyncedMessages: false,
  setHasSyncedMessages: (hasSyncedMessages) =>
    set(() => ({ hasSyncedMessages })),
  previewMessages: new Map(),
  setPreviewMessages: (previewMessages) => set(() => ({ previewMessages })),
  previewMessagesNonLens: new Map(),
  setPreviewMessagesNonLens: (previewMessagesNonLens) =>
    set(() => ({ previewMessagesNonLens })),
  selectedProfileId: '',
  setSelectedProfileId: (selectedProfileId) =>
    set(() => ({ selectedProfileId })),
  selectedTab: 'Following',
  setSelectedTab: (selectedTab) => set(() => ({ selectedTab })),
  syncedProfiles: new Set(),
  addSyncedProfiles: (profileIds) =>
    set(({ syncedProfiles }) => ({
      syncedProfiles: new Set([...syncedProfiles, ...profileIds])
    })),
  unsyncProfile: (profileId: string) =>
    set(({ syncedProfiles }) => ({
      syncedProfiles: new Set(
        [...syncedProfiles].filter((id) => id !== profileId)
      )
    })),
  reset: () =>
    set((state) => {
      return {
        ...state,
        conversations: new Map(),
        messages: new Map(),
        messageProfiles: new Map(),
        previewMessages: new Map(),
        selectedTab: 'Following',
        previewMessagesNonLens: new Map()
      };
    })
}));

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
