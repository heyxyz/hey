import { create } from 'zustand';

export interface Message {
  content: string;
  conversationId: string;
  createdAt: string;
  id: string;
}

export interface Conversation {
  id: string;
  messages: Message[];
  recipient: string;
  sender: string;
  updatedAt: string;
}

interface MessageState {
  conversations: Conversation[] | null;
  messages: Message[] | null;
  selectedConversation: null | string;
  setConversations: (conversations: Conversation[]) => void;
  setMessages: (messages: Message[]) => void;
  setSelectedConversation: (conversation: null | string) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  conversations: null,
  messages: null,
  selectedConversation: null,
  setConversations: (conversations) => set({ conversations }),
  setMessages: (messages) => set({ messages }),
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation })
}));
