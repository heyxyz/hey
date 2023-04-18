import { MESSAGING_PROVIDER } from 'src/constants';
import { create } from 'zustand';

interface MessageState {
  chatProvider: string;
  setChatProvider: (chatProvider: string) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  chatProvider: MESSAGING_PROVIDER.PUSH,
  setChatProvider: (chatProvider) => set(() => ({ chatProvider }))
}));
