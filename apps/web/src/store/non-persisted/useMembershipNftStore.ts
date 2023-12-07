import { create } from 'zustand';

interface MembershipNftStoreState {
  dismissedOrMinted: boolean;
  setDismissedOrMinted: (dismissedOrMinted: boolean) => void;
}

export const useMembershipNftStore = create<MembershipNftStoreState>((set) => ({
  dismissedOrMinted: true,
  setDismissedOrMinted: (dismissedOrMinted) =>
    set(() => ({ dismissedOrMinted }))
}));
