import type { Profile } from '@hey/lens';
import type { IFeeds, IMessageIPFS } from '@pushprotocol/restapi';

import { IS_MAINNET } from '@hey/data/constants';
import { Localstorage } from '@hey/data/storage';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const PUSH_TABS = {
  CHATS: 'CHATS',
  REQUESTS: 'REQUESTS'
} as const;

export const CHAT_TYPES = {
  CHAT: 'chat'
} as const;

export type ParsedChatType = {
  id: string;
  img: string;
  name: string;
  recipient: string;
  text: string;
  threadHash: string;
  time: string;
};

export type ChatTypes = (typeof CHAT_TYPES)[keyof typeof CHAT_TYPES];
export type PushTabs = (typeof PUSH_TABS)[keyof typeof PUSH_TABS];

export const PUSH_ENV = IS_MAINNET ? ENV.PROD : ENV.DEV;

interface IPushChatStore {
  activeReceiptientID: null | string;
  activeTab: PushTabs;
  clearRecipientChat: () => void;
  deleteRequestFeed: (requestId: string) => void;
  pgpPrivateKey: null | string;
  recipientChats: IMessageIPFS[] | null;
  recipientProfile: null | Profile;
  requestsFeed: IFeeds[];
  setActiveTab: (tabName: PushTabs) => void;
  setPgpPrivateKey: (pgpPrivateKey: string) => void;
  setRecipientChat: (chat: IMessageIPFS) => void;
  setRecipientProfile: (profile: Profile) => void;
  updateRequestsFeed: (requestsFeed: IFeeds[]) => void;
}

export const usePushChatStore = create(
  persist<IPushChatStore>(
    (set) => ({
      activeReceiptientID: null,
      activeTab: PUSH_TABS.CHATS,
      clearRecipientChat: () => set(() => ({ recipientChats: [] })),
      deleteRequestFeed: (requestID: string) =>
        set((state) => {
          const requestsFeed = state.requestsFeed.filter(
            (feed) => feed.did !== requestID
          );
          return { requestsFeed };
        }),
      pgpPrivateKey: null,
      recipientChats: [],
      recipientProfile: null,
      requestsFeed: [] as IFeeds[],
      resetPushChatStore: () =>
        set((state) => {
          return {
            ...state,
            activeTab: PUSH_TABS.CHATS,
            pgpPrivateKey: null,
            recipientProfile: null
          };
        }),
      selectedChatType: null,
      setActiveTab: (activeTab) => set(() => ({ activeTab })),
      setPgpPrivateKey: (pgpPrivateKey) => set(() => ({ pgpPrivateKey })),
      setRecipientChat: (newChat: IMessageIPFS) =>
        set((state) => {
          const recipientChats = [...(state.recipientChats || []), newChat];
          return { recipientChats };
        }),
      setRecipientProfile: (receiptientProfile) =>
        set(() => ({ recipientProfile: receiptientProfile })),
      setRequestFeed: (id: string, newRequestFeed: IFeeds) => {
        set((state) => {
          const requestsFeed = { ...state.requestsFeed, [id]: newRequestFeed };
          return { requestsFeed };
        });
      },
      updateRequestsFeed: (requestsFeed) =>
        set((state) => ({ ...state, requestsFeed }))
    }),
    {
      name: Localstorage.PushStore
    }
  )
);
