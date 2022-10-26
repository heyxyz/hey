import type { Profile } from '@generated/types';
import getUniqueMessages from '@lib/getUniqueMessages';
import type { Client, Conversation, Message } from '@xmtp/xmtp-js';
import create from 'zustand';

interface MessageState {
  client: Client | undefined;
  setClient: (client: Client | undefined) => void;
  conversations: Map<string, Conversation>;
  setConversations: (conversations: Map<string, Conversation>) => void;
  messages: Map<string, Message[]>;
  setMessages: (messages: Map<string, Message[]>) => void;
  addMessages: (key: string, newMessages: Message[]) => number;
  messageProfiles: Map<string, Profile>;
  setMessageProfiles: (messageProfiles: Map<string, Profile>) => void;
  previewMessages: Map<string, Message>;
  setPreviewMessage: (key: string, message: Message) => void;
  setPreviewMessages: (previewMessages: Map<string, Message>) => void;
  reset: () => void;
  selectedProfileId: string;
  setSelectedProfileId: (selectedProfileId: string) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  client: undefined,
  setClient: (client) => set(() => ({ client })),
  conversations: new Map(),
  setConversations: (conversations) => set(() => ({ conversations })),
  messages: new Map(),
  setMessages: (messages) => set(() => ({ messages })),
  addMessages: (key: string, newMessages: Message[]) => {
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
  messageProfiles: new Map(),
  setMessageProfiles: (messageProfiles) => set(() => ({ messageProfiles })),
  previewMessages: new Map(),
  setPreviewMessage: (key: string, message: Message) =>
    set((state) => {
      const newPreviewMessages = new Map(state.previewMessages);
      newPreviewMessages.set(key, message);
      return { previewMessages: newPreviewMessages };
    }),
  setPreviewMessages: (previewMessages) => set(() => ({ previewMessages })),
  selectedProfileId: '',
  setSelectedProfileId: (selectedProfileId) => set(() => ({ selectedProfileId })),
  reset: () =>
    set((state) => {
      return {
        ...state,
        conversations: new Map(),
        messages: new Map(),
        messageProfiles: new Map(),
        previewMessages: new Map()
      };
    })
}));
