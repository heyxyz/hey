import type { IFeeds, IMessageIPFS, IUser } from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { IS_MAINNET } from 'data';
import type { Profile } from 'lens';
import { create } from 'zustand';

export const PUSH_TABS = {
  CHATS: 'CHATS',
  REQUESTS: 'REQUESTS'
} as const;

export const CHAT_TYPES = {
  CHAT: 'chat',
  GROUP: 'group'
} as const;

export type ParsedChatType = {
  id: string;
  img: string;
  name: string;
  text: string;
  time: string;
  recipient: string;
  threadHash: string;
};

type ChatTypes = (typeof CHAT_TYPES)[keyof typeof CHAT_TYPES];
type PushTabs = (typeof PUSH_TABS)[keyof typeof PUSH_TABS];

type ChatMessagetype = { messages: IMessageIPFS[]; lastThreadHash: string | null };
export const PUSH_ENV = IS_MAINNET ? ENV.PROD : ENV.STAGING;

interface IPushChatStore {
  connectedProfile: IUser | undefined;
  setConnectedProfile: (connectedProfile: IUser) => void;
  activeTab: PushTabs;
  setActiveTab: (tabName: PushTabs) => void;
  chats: Map<string, ChatMessagetype>; // chatId -> chat messages array
  setChats: (chats: Map<string, ChatMessagetype>) => void;
  addChat: (key: string, newChat: ChatMessagetype) => void;
  chatsFeed: { [key: string]: IFeeds }; // chatId -> feed obj
  setChatsFeed: (chatsFeed: { [key: string]: IFeeds }) => void;
  addChatFeed: (id: string, newChatFeed: IFeeds) => void;
  requestsFeed: { [key: string]: IFeeds }; // requestId -> feed obj
  setRequestsFeed: (requestsFeed: { [key: string]: IFeeds }) => void;
  addRequestFeed: (id: string, newRequestFeed: IFeeds) => void;
  lensProfiles: Map<string, Profile>;
  setLensProfiles: (lensProfiles: Map<string, Profile>) => void;
  reset: () => void;
  selectedChatId: string;
  setSelectedChatId: (selectedChatId: string) => void;
  selectedChatType: ChatTypes | null;
  setSelectedChatType: (tabName: ChatTypes) => void;
  threadHash: string;
  setThreadHash: (threadHash: string) => void;
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
  pushChatSocket: any; // replace any with the actual type of socket connection
  setPushChatSocket: (pushChatSocket: any) => void;
}

export const usePushChatStore = create<IPushChatStore>((set) => ({
  connectedProfile: undefined,
  setConnectedProfile: (connectedProfile) => set(() => ({ connectedProfile })),
  activeTab: PUSH_TABS.CHATS,
  setActiveTab: (activeTab) => set(() => ({ activeTab })),
  chats: new Map(),
  setChats: (chats) => set(() => ({ chats })),
  addChat: (key: string, newChat: ChatMessagetype) => {
    set((state) => {
      const chats = new Map(state.chats);
      chats.set(key, newChat);
      return { chats };
    });
  },
  chatsFeed: {} as { [key: string]: IFeeds },
  setChatsFeed: (chatsFeed) => set(() => ({ chatsFeed })),
  addChatFeed: (id: string, newChatFeed: IFeeds) => {
    set((state) => {
      const chatsFeed = { ...state.chatsFeed, [id]: newChatFeed };
      return { chatsFeed };
    });
  },
  requestsFeed: {} as { [key: string]: IFeeds },
  setRequestsFeed: (requestsFeed) => set(() => ({ requestsFeed })),
  addRequestFeed: (id: string, newRequestFeed: IFeeds) => {
    set((state) => {
      const requestsFeed = { ...state.requestsFeed, [id]: newRequestFeed };
      return { requestsFeed };
    });
  },
  lensProfiles: new Map(),
  setLensProfiles: (lensProfiles) =>
    set((state) => ({
      lensProfiles:
        state.lensProfiles.size === 0 ? lensProfiles : new Map([...state.lensProfiles, ...lensProfiles])
    })),
  threadHash: '',
  setThreadHash: (threadHash: string) => set(() => ({ threadHash })),
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
  pushChatSocket: null,
  setPushChatSocket: (pushChatSocket) => set(() => ({ pushChatSocket })),
  reset: () =>
    set((state) => {
      return {
        ...state,
        connectedProfile: undefined,
        chats: new Map(),
        chatsFeed: {} as { [key: string]: IFeeds },
        requestsFeed: {} as { [key: string]: IFeeds },
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
