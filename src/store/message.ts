import type { Profile } from '@generated/types';
import type { Client, Conversation, Message } from '@xmtp/xmtp-js';
import create from 'zustand';

interface MessageState {
  client: Client | undefined;
  setClient: (client: Client) => void;
  conversations: Map<string, Conversation>;
  setConversations: (conversations: Map<string, Conversation>) => void;
  messages: Map<string, Message[]>;
  setMessages: (messages: Map<string, Message[]>) => void;
  messageProfiles: Map<string, Profile>;
  setMessageProfiles: (messageProfiles: Map<string, Profile>) => void;
  previewMessages: Map<string, Message>;
  setPreviewMessages: (previewMessages: Map<string, Message>) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  client: undefined,
  setClient: (client) => set(() => ({ client })),
  conversations: new Map(),
  setConversations: (conversations) => set(() => ({ conversations })),
  messages: new Map(),
  setMessages: (messages) => set(() => ({ messages })),
  messageProfiles: new Map(),
  setMessageProfiles: (messageProfiles) => set(() => ({ messageProfiles })),
  previewMessages: new Map(),
  setPreviewMessages: (previewMessages) => set(() => ({ previewMessages }))
}));
