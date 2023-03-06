import type { ConversationExport } from '@xmtp/xmtp-js/dist/types/src/conversations/Conversation';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// If any breaking changes to the ConversationExport schema occur, increment the cache version.
const CONVERSATION_CACHE_VERSION = 1;

/**
 * The ConversationCache is a JSON serializable Zustand store that is persisted to LocalStorage
 * Persisting conversations to the cache saves on both bandwidth and CPU cycles, as we don't have to re-fetch or re-decrypt conversations on subsequent page loads
 */
interface ConversationCache {
  // Mapping of conversation exports, keyed by wallet address
  conversations: { [walletAddress: string]: ConversationExport[] };
  // Overwrite the cache for a given wallet address
  setConversations: (walletAddress: string, conversations: ConversationExport[]) => void;
  // Add a single conversation to the cache.
  // Deduping only happens at the time the cache is loaded, so be careful to not overfill or you will use more LocalStorage space than necessary
  addConversation: (walletAddress: string, conversation: ConversationExport) => void;
}

export const useConversationCache = create<ConversationCache>()(
  persist(
    (set, get) => ({
      conversations: {},
      setConversations: (walletAddress: string, convos: ConversationExport[]) =>
        set({
          conversations: { ...get().conversations, [walletAddress]: convos }
        }),
      addConversation: (walletAddress: string, convo: ConversationExport) => {
        const existing = get().conversations;
        const existingForWallet = existing[walletAddress] || [];
        return set({
          conversations: {
            ...existing,
            [walletAddress]: [...existingForWallet, convo]
          }
        });
      }
    }),
    {
      // Ensure that the LocalStorage key includes the network and the cache version
      // If any breaking changes to the ConversationExport schema occur, increment the cache version.
      name: `lenster:conversations:${
        process.env.NEXT_PUBLIC_LENS_NETWORK || 'unknown'
      }:v${CONVERSATION_CACHE_VERSION}`,
      partialize: (state) => ({ conversations: state.conversations })
    }
  )
);
