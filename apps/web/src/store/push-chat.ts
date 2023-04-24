import type { IFeeds, IMessageIPFS, IUser } from '@pushprotocol/restapi';
import { create } from 'zustand';

type TabValues = 'Chats' | 'Requests';
export const PUSH_TABS = {
  CHATS: 'CHATS',
  REQUESTS: 'REQUESTS'
};
interface IPushChatStore {
  connectedProfile: IUser | undefined;
  setConnectedProfile: (connectedProfile: IUser) => void;
  activeTab: String;
  setActiveTab: (tabName: string) => void;
  chats: Map<string, Array<IMessageIPFS>>; // chatId -> chat messages array
  setChats: (chats: Map<string, Array<IMessageIPFS>>) => void;
  addChat: (key: string, newChat: Array<IMessageIPFS>) => void;
  chatsFeed: Map<string, IFeeds>; // chatId -> feed obj
  setChatsFeed: (chatsFeed: Map<string, IFeeds>) => void;
  addChatFeed: (key: string, newChatFeed: IFeeds) => void;
  requestsFeed: Map<string, IFeeds>; // requestId -> feed obj
  setRequestsFeed: (requests: Map<string, IFeeds>) => void;
  addRequestFeed: (key: string, newRequestFeed: IFeeds) => void;
  reset: () => void;
  selectedChatId: string;
  setSelectedChatId: (selectedChatId: string) => void;
  selectedTab: TabValues;
  setSelectedTab: (selectedTab: TabValues) => void;
  showCreateChatProfileModal: boolean;
  setShowCreateChatProfileModal: (showCreateChatProfileModal: boolean) => void;
}

export const usePushChatStore = create<IPushChatStore>((set) => ({
  connectedProfile: undefined,
  setConnectedProfile: (connectedProfile) => set(() => ({ connectedProfile })),
  activeTab: PUSH_TABS.CHATS,
  setActiveTab: (activeTab) => set(() => ({ activeTab })),
  chats: new Map(),
  setChats: (chats) => set(() => ({ chats })),
  addChat: (key: string, newChat: Array<IMessageIPFS>) => {
    set((state) => {
      const chats = new Map(state.chats);
      chats.set(key, newChat);
      return { chats };
    });
  },
  chatsFeed: new Map(),
  setChatsFeed: (chatsFeed) => set(() => ({ chatsFeed })),
  addChatFeed: (key: string, newChatFeed: IFeeds) => {
    set((state) => {
      const chatsFeed = new Map(state.chatsFeed);
      chatsFeed.set(key, newChatFeed);
      return { chatsFeed };
    });
  },
  requestsFeed: new Map(),
  setRequestsFeed: (requestsFeed) => set(() => ({ requestsFeed })),
  addRequestFeed: (key: string, newrequestFeed: IFeeds) => {
    set((state) => {
      const requestsFeed = new Map(state.requestsFeed);
      requestsFeed.set(key, newrequestFeed);
      return { requestsFeed };
    });
  },
  selectedChatId: '',
  setSelectedChatId: (selectedChatId) => set(() => ({ selectedChatId })),
  selectedTab: 'Chats',
  setSelectedTab: (selectedTab) => set(() => ({ selectedTab })),
  showCreateChatProfileModal: false,
  setShowCreateChatProfileModal: (showCreateChatProfileModal) => set(() => ({ showCreateChatProfileModal })),
  reset: () =>
    set((state) => {
      return {
        ...state,
        chats: new Map(),
        chatsFeed: new Map(),
        requestsFeed: new Map(),
        selectedTab: 'Chats'
      };
    })
}));
