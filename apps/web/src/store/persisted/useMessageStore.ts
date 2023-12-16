import { create } from 'zustand';

export interface Message {
  content: string;
  conversationId: string;
  createdAt: string;
  id: string;
  senderId: string;
}

export interface Conversation {
  id: string;
  latestMessages: string;
  profile: string;
  recipient: string;
  sender: string;
  updatedAt: string;
}

interface SelectedConversation {
  id: null | string;
  profile: string;
}

interface MessageState {
  conversations: Conversation[] | null;
  messages: Message[] | null;
  selectedConversation: null | SelectedConversation;
  setConversations: (conversations: Conversation[]) => void;
  setMessages: (messages: Message[]) => void;
  setSelectedConversation: (conversation: null | SelectedConversation) => void;
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
