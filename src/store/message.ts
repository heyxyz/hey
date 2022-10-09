import type { Client, Conversation, Message } from '@xmtp/xmtp-js';
import create from 'zustand';

interface MessageState {
  client: Client | undefined;
  setClient: (client: Client) => void;
  conversations: Map<string, Conversation>;
  setConversations: (conversations: Map<string, Conversation>) => void;
  messages: Map<string, Message[]>;
  setMessages: (messages: Map<string, Message[]>) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  client: undefined,
  setClient: (client) => set(() => ({ client })),
  conversations: new Map(),
  setConversations: (conversations) => set(() => ({ conversations })),
  messages: new Map(),
  setMessages: (messages) => set(() => ({ messages })),
  loading: false,
  setLoading: (loading) => set(() => ({ loading }))
}));
