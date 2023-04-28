import type { IFeeds, IMessageIPFS, IUser } from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { IS_MAINNET } from 'data';
import { create } from 'zustand';

export const PUSH_TABS = {
  CHATS: 'CHATS',
  REQUESTS: 'REQUESTS'
} as const;
export const CHAT_TYPES = {
  CHAT: 'chat',
  GROUP: 'group'
} as const;
type ChatTypes = (typeof CHAT_TYPES)[keyof typeof CHAT_TYPES];
type PushTabs = (typeof PUSH_TABS)[keyof typeof PUSH_TABS];

export const PUSH_ENV = IS_MAINNET ? ENV.PROD : ENV.STAGING;

interface IPushChatStore {
  connectedProfile: IUser | undefined;
  setConnectedProfile: (connectedProfile: IUser) => void;
  activeTab: PushTabs;
  setActiveTab: (tabName: PushTabs) => void;
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
  selectedChatType: ChatTypes | null;
  setSelectedChatType: (tabName: ChatTypes) => void;
  showCreateChatProfileModal: boolean;
  setShowCreateChatProfileModal: (showCreateChatProfileModal: boolean) => void;
  showDecryptionModal: boolean;
  setShowDecryptionModal: (showDecryptionModal: boolean) => void;
  showUpgradeChatProfileModal: boolean;
  setShowUpgradeChatProfileModal: (showUpgradeChatProfileModal: boolean) => void;
  password: {
    encrypted: string | null;
    decrypted: string | null;
  };
  setPassword: (password: { encrypted?: string; decrypted?: string }) => void;
  pgpPrivateKey: {
    encrypted: string | null;
    decrypted: string | null;
  };
  setPgpPrivateKey: (pgpPrivateKey: { encrypted?: string; decrypted?: string }) => void;
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
  selectedChatType: null,
  setSelectedChatId: (selectedChatId) => set(() => ({ selectedChatId })),
  setSelectedChatType: (selectedChatType) => set(() => ({ selectedChatType })),
  showCreateChatProfileModal: false,
  setShowCreateChatProfileModal: (showCreateChatProfileModal) => set(() => ({ showCreateChatProfileModal })),
  showDecryptionModal: false,
  setShowDecryptionModal: (showDecryptionModal) => set(() => ({ showDecryptionModal })),
  showUpgradeChatProfileModal: false,
  setShowUpgradeChatProfileModal: (showUpgradeChatProfileModal) =>
    set(() => ({ showUpgradeChatProfileModal })),
  password: {
    encrypted: null,
    decrypted: null
  },
  setPassword: ({ encrypted, decrypted }) => {
    set((state) => {
      const password = { ...state.password };
      if (encrypted) {
        password.encrypted = encrypted;
      }
      if (decrypted) {
        password.decrypted = decrypted;
      }
      return { password };
    });
  },
  pgpPrivateKey: {
    encrypted: null,
    decrypted: null
  },
  setPgpPrivateKey: ({ encrypted, decrypted }) => {
    set((state) => {
      const pgpPrivateKey = { ...state.pgpPrivateKey };
      if (encrypted) {
        pgpPrivateKey.encrypted = encrypted;
      }
      if (decrypted) {
        pgpPrivateKey.decrypted = decrypted;
      }
      return { pgpPrivateKey };
    });
  },
  reset: () =>
    set((state) => {
      return {
        ...state,
        connectedProfile: undefined,
        chats: new Map(),
        chatsFeed: new Map(),
        requestsFeed: new Map(),
        activeTab: PUSH_TABS.CHATS,
        password: {
          encrypted: null,
          decrypted: null
        },
        pgpPrivateKey: {
          encrypted: null,
          decrypted: null
        }
      };
    })
}));
