import { create } from 'zustand';

interface MobileState {
  homeGradientColor: string;
  setHomeGradientColor: (homeGradientColor: string) => void;
}

const useMobileStore = create<MobileState>((set) => ({
  homeGradientColor: '#000000',
  setHomeGradientColor: (homeGradientColor) => set({ homeGradientColor })
}));

export default useMobileStore;
