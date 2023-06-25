import { create } from 'zustand';

interface AuthPerisistState {
  homeGradientColor: string;
  setHomeGradientColor: (homeGradientColor: string) => void;
}

const useMobileStore = create<AuthPerisistState>((set) => ({
  homeGradientColor: '#000000',
  setHomeGradientColor: (homeGradientColor) => set({ homeGradientColor })
}));

export default useMobileStore;
