import { create } from 'zustand';

interface ProState {
  isPro: boolean;
  resetPro: () => void;
  setIsPro: (isPro: boolean) => void;
}

export const useProStore = create<ProState>((set) => ({
  isPro: false,
  resetPro: () =>
    set(() => ({
      isPro: false
    })),
  setIsPro: (isPro) => set(() => ({ isPro }))
}));
