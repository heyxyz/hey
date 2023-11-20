import { create } from 'zustand';

interface ProState {
  isPro: boolean;
  setIsPro: (isPro: boolean) => void;
  resetPro: () => void;
}

export const useProStore = create<ProState>((set) => ({
  isPro: false,
  setIsPro: (isPro) => set(() => ({ isPro })),
  resetPro: () =>
    set(() => ({
      isPro: false
    }))
}));
