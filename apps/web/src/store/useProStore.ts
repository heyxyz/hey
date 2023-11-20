import { create } from 'zustand';

interface ProState {
  loadingPro: boolean;
  setLoadingPro: (loadingPro: boolean) => void;
  isPro: boolean;
  setIsPro: (isPro: boolean) => void;
  resetPro: () => void;
}

export const useProStore = create<ProState>((set) => ({
  loadingPro: true,
  setLoadingPro: (loadingPro) => set(() => ({ loadingPro })),
  isPro: false,
  setIsPro: (isPro) => set(() => ({ isPro })),
  resetPro: () =>
    set(() => ({
      isPro: false
    }))
}));
