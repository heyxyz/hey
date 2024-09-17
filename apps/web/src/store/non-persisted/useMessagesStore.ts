import type { CachedConversation } from "@xmtp/react-sdk";
import type { Address } from "viem";

import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  newConversationAddress: Address | null;
  selectedConversation: CachedConversation | null;
  setNewConversationAddress: (newConversationAddress: Address | null) => void;
  setSelectedConversation: (
    selectedConversation: CachedConversation | null
  ) => void;
}

const store = create<State>((set) => ({
  newConversationAddress: null,
  selectedConversation: null,
  setNewConversationAddress: (newConversationAddress) =>
    set(() => ({ newConversationAddress })),
  setSelectedConversation: (selectedConversation) =>
    set(() => ({ selectedConversation }))
}));

export const useMessagesStore = createTrackedSelector(store);
