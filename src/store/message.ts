import type { MessagePreview } from '@components/Messages';
import type { Client, Conversation, Message } from '@xmtp/xmtp-js';
import create from 'zustand';

interface MessageState {
  client: Client | undefined;
  setClient: (client: Client) => void;
  conversations: Map<string, Conversation>;
  setConversations: (conversations: Map<string, Conversation>) => void;
  messages: Map<string, Message[]>;
  setMessages: (messages: Map<string, Message[]>) => void;
  loadingMessages: boolean;
  setLoadingMessages: (loading: boolean) => void;
  messagePreviews: Map<string, MessagePreview>;
  setMessagePreviews: (messagePreviews: Map<string, MessagePreview>) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  client: undefined,
  setClient: (client) => set(() => ({ client })),
  conversations: new Map(),
  setConversations: (conversations) => set(() => ({ conversations })),
  messages: new Map(),
  setMessages: (messages) => set(() => ({ messages })),
  loadingMessages: false,
  setLoadingMessages: (loadingMessages) => set(() => ({ loadingMessages })),
  messagePreviews: new Map(),
  setMessagePreviews: (messagePreviews) => set(() => ({ messagePreviews }))
}));
