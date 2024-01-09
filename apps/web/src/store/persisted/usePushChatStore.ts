import type {
  IFeeds,
  IMessageIPFS,
  IMessageIPFSWithCID,
  IUser
} from '@pushprotocol/restapi';

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

export type ChatTypes = (typeof CHAT_TYPES)[keyof typeof CHAT_TYPES];
export type PushTabs = (typeof PUSH_TABS)[keyof typeof PUSH_TABS];

export const PUSH_ENV = IS_MAINNET ? ENV.PROD : ENV.DEV;

export interface Profile {
  id: string;
  localHandle: string;
  ownedBy: {
    address: string;
  };
  threadHash: null | string;
}

interface IPushChatStore {
  activeReceiptientID: null | string;
  activeTab: PushTabs;
  clearRecipientChat: () => void;
  connectedProfile: IUser | null;
  deleteRequestFeed: (requestId: string) => void;
  deleteUnsentMessage: (message: IMessageIPFSWithCID) => void;
  mediaEmbedContentTypes: Record<string, null | string>;
  pgpPassword: null | string;
  pgpPrivateKey: null | string;
  recipientChats: [] | IMessageIPFSWithCID[];
  recipientProfile: null | Profile;
  replyToMessage: IMessageIPFSWithCID | null;
  requestsFeed: IFeeds[];
  setActiveTab: (tabName: PushTabs) => void;
  setConnectedProfile: (profile: IUser) => void;
  setMediaEmbedContentType: (type: string, value: null | string) => void;
  setPgpPassword: (password: string) => void;
  setPgpPrivateKey: (pgpPrivateKey: string) => void;
  setRecipientChat: (chat: IMessageIPFSWithCID[]) => void;
  setRecipientProfile: (profile: Profile) => void;
  setReplyToMessage: (message: IMessageIPFSWithCID | null) => void;
  setUnsentMessage: (message: IMessageIPFSWithCID) => void;
  unsentMessages: [] | IMessageIPFSWithCID[];
  updateRequestsFeed: (requestsFeed: IFeeds[]) => void;
}

export const usePushChatStore = create(
  persist<IPushChatStore>(
    (set) => ({
      activeReceiptientID: null,
      activeTab: PUSH_TABS.CHATS,
      clearRecipientChat: () => set(() => ({ recipientChats: [] })),
      connectedProfile: null,
      deleteRequestFeed: (requestID: string) =>
        set((state) => {
          const requestsFeed = state.requestsFeed.filter(
            (feed) => feed.did !== requestID
          );
          return { requestsFeed };
        }),
      deleteUnsentMessage: (message: IMessageIPFS) =>
        set((state) => {
          const unsentMessages = state.unsentMessages.filter(
            (unsentMessage) => unsentMessage.link !== message.link
          );
          return { unsentMessages };
        }),
      mediaEmbedContentTypes: {},
      pgpPassword: null,
      pgpPrivateKey: null,
      recipientChats: [],
      recipientProfile: null,
      replyToMessage: null,
      requestsFeed: [] as IFeeds[],
      resetPushChatStore: () =>
        set((state) => {
          return {
            ...state,
            activeTab: PUSH_TABS.CHATS,
            pgpPassword: null,
            pgpPrivateKey: null,
            recipientChats: []
          };
        }),
      selectedChatType: null,
      setActiveTab: (activeTab) => set(() => ({ activeTab })),
      setConnectedProfile: (connectedProfile) =>
        set(() => ({ connectedProfile })),
      setMediaEmbedContentType: (uri: string, contentType: null | string) =>
        set((state) => ({
          mediaEmbedContentTypes: {
            ...state.mediaEmbedContentTypes,
            [uri]: contentType
          }
        })),
      setPgpPassword: (pgpPassword) => set(() => ({ pgpPassword })),
      setPgpPrivateKey: (pgpPrivateKey) => set(() => ({ pgpPrivateKey })),
      setRecipientChat: (chat: IMessageIPFSWithCID[]) =>
        set((state) => {
          const recipientChats = [...state.recipientChats, ...chat];
          return { recipientChats };
        }),
      setRecipientProfile: (receiptientProfile) =>
        set(() => ({ recipientProfile: receiptientProfile })),
      setReplyToMessage: (replyToMessage) => set(() => ({ replyToMessage })),
      setRequestFeed: (id: string, newRequestFeed: IFeeds) => {
        set((state) => {
          const requestsFeed = { ...state.requestsFeed, [id]: newRequestFeed };
          return { requestsFeed };
        });
      },
      setUnsentMessage: (message: IMessageIPFSWithCID) =>
        set((state) => {
          const unsentMessages: IMessageIPFSWithCID[] =
            state.unsentMessages || [];
          if (
            !unsentMessages.find(
              (unsentMessage) => unsentMessage.link === message.link
            )
          ) {
            unsentMessages.push(message);
          }
          return { unsentMessages };
        }),
      unsentMessages: [],
      updateRequestsFeed: (requestsFeed) =>
        set((state) => ({ ...state, requestsFeed }))
    }),
    {
      name: Localstorage.PushStore
    }
  )
);
