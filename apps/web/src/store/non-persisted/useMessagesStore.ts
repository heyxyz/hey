import type { CachedConversation } from '@xmtp/react-sdk';
import type { Address } from 'viem';

import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  selectedConversation: CachedConversation | null;
  setSelectedConversation: (
    selectedConversation: CachedConversation | null
  ) => void;
  setXmtpAddress: (address: Address) => void;
  xmtpAddress: Address | null;
}

const store = create<State>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set(() => ({ selectedConversation })),
  setXmtpAddress: (xmtpAddress) => set(() => ({ xmtpAddress })),
  xmtpAddress: null
}));

export const useMessagesStore = createTrackedSelector(store);
